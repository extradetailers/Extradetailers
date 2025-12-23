"use client";

import { IAddOnServicePopulated, IBooking, IVehicleType, TModuleStyle } from "@/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ItemList from "./ItemList";
import PaymentCard from "./PaymentCard";
import {
  useMutation,
  useQuery,
  // useSuspenseQuery,
} from "@tanstack/react-query";
import {
  combinedServicesOptions,
} from "@/app/_requests/services";
import { useCreatePaymentIntentOptions } from "@/app/_requests/payments";
import useBookingList from "@/hooks/useBookingList";

interface ICheckoutProps {
  styles: TModuleStyle;
}

// const TAX = 0.08;
const TAX = 0;

function Checkout({ styles }: ICheckoutProps) {
  const [bookingList, setBookingList] = useBookingList();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<null | IBooking>(null);

  const { data: combinedServices } = useQuery(combinedServicesOptions);

  const calcAddonPrice = useCallback((addon: IAddOnServicePopulated) => {
    const price = parseInt(addon.price_min, 10);
    // totalPrice += price;
    return price.toFixed(0);
  }, []);

  const addonServices = useMemo(() => {
    if (!selectedBooking) return null;
    const addonServiceList = combinedServices?.addon_services.filter(
      (ad) => ad.id && selectedBooking.addons.includes(ad.id)
    );
    return addonServiceList;
  }, [bookingList, combinedServices, selectedBooking]);

  const vehicleTypeMap: Map<number, IVehicleType> = useMemo(() => {
    if (!combinedServices?.vehicle_types) return new Map();
    return new Map(combinedServices.vehicle_types.map((vt) => [vt.id, vt]));
  }, [combinedServices?.vehicle_types]);

  const serviceMap = useMemo(() => {
    const services = new Map(
      combinedServices?.services.map((s) => [s.id || 0, s])
    );
    return services;
  }, [combinedServices]);

  const calcServicePrice = useCallback(
    (booking: IBooking) => {
      const price = parseInt(
        String(
          serviceMap
            .get(booking.service)
            ?.prices.find(
              (p) => p.vehicle_type === vehicleTypeMap.get(p.vehicle_type)?.id
            )?.price || "0"
        ),
        10
      );
      // totalPrice += price;
      return price.toFixed(0);
    },
    [bookingList]
  );

  const { subTotal, totalPrice, tax } = useMemo(() => {
    const serviceTotal = bookingList.reduce(
      (sum, b) =>
        sum +
        parseInt(
          String(
            serviceMap
              .get(b.service)
              ?.prices.find(
                (p) => p.vehicle_type === vehicleTypeMap.get(p.vehicle_type)?.id
              )?.price || "0"
          ),
          10
        ),
      0
    );
    const addonTotal =
      addonServices?.reduce((sum, a) => sum + parseInt(a.price_min, 10), 0) ||
      0;

    const sub = serviceTotal + addonTotal;
    const tax =  (serviceTotal + addonTotal) * TAX;
    const total = tax + sub;
    return { subTotal: sub, totalPrice: total, tax };
  }, [bookingList, addonServices, serviceMap, vehicleTypeMap]);

  // Payment mutation — created after cartItems are set
  // ✅ UseMutation for creating a service
  // @ts-ignore
  const createIntentMutation = useMutation(useCreatePaymentIntentOptions());

  // Create Payment Intent once cartItems are loaded
  useEffect(() => {
    if (bookingList.length === 0) return;

    // Prepare bookings for backend
    createIntentMutation
      .mutateAsync(bookingList)
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        console.error("Failed to create payment intent", err);
      });
  }, [bookingList]);

  useEffect(() => {
    if (bookingList.length > 0) {
      setSelectedBooking(bookingList[0]);
    }
  }, [bookingList]);

  return (
    <div className="container">
      <div className="row g-5 align-items-start">
        <div className="col-lg-8">
          <h2 className="mb-4">Shopping Cart</h2>
          <p className="text-muted">
            Review your selected services before checkout.
          </p>
          {bookingList.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <div id="selectedPackage" className="mb-3">
              <h3>Services</h3>
              <div className="alert alert-primary">
                {bookingList.length === 0 ? (
                  <p className="text-muted mb-2">No package selected yet</p>
                ) : (
                  bookingList.map((booking) => (
                    <div
                      key={booking.id}
                      className="w-100 d-flex justify-content-between align-items-center gap-2"
                    >
                      <p className={`text-muted p-0 m-0 ${styles.serviceName}`}>
                        {serviceMap.get(booking.service)?.title}
                      </p>
                      <p
                        className={`text-muted p-0 m-0 ${styles.servicePrice} `}
                      >
                        ${calcServicePrice(booking)}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <h3>Add On Services</h3>
              <div className="alert alert-primary">
              {!addonServices || addonServices.length === 0 ? (
                <p className="text-muted mb-2">No addon selected yet</p>
              ) : (
                addonServices.map(
                  (addon) =>
                    addon && (
                      <div
                        key={addon.id}
                        className="w-100 d-flex justify-content-start align-items-center gap-2"
                      >
                        <p
                          className={`text-muted p-0 m-0 ${styles.serviceName}`}
                        >
                          {addon.name}
                        </p>
                        <p
                          className={`text-muted p-0 m-0 ${styles.servicePrice} `}
                        >
                          ${calcAddonPrice(addon)}
                        </p>
                      </div>
                    )
                )
              )}
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          <PaymentCard
            total={totalPrice}
            subTotal={subTotal}
            tax={tax}
            clientSecret={clientSecret}
            styles={styles}
          />
        </div>
      </div>
    </div>
  );
}

export default Checkout;

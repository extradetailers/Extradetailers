"use client";

import { combinedServicesOptions } from "@/app/_requests/services";
import useBookingList from "@/hooks/useBookingList";
import useUser from "@/hooks/useUser";
import {
  IAddOnService,
  IAddOnServicePopulated,
  IBooking,
  IVehicleType,
  TModuleStyle,
} from "@/types";
import LocalStorage from "@/utils/LocalStorage";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CiSquareRemove } from "react-icons/ci";

// const TAX = 0.08;
const TAX = 0;

function PackageSelectionSidebar({ styles }: { styles: TModuleStyle }) {
  const router = useRouter();
  const [bookingList, setBookingList] = useBookingList();
  const [selectedBooking, setSelectedBooking] = useState<null | IBooking>(null);
  const user = useUser();

  const { data: combinedServices } = useQuery(combinedServicesOptions);

  const handleRemoveBooking = (e: React.SyntheticEvent, booking: IBooking) => {
    e.preventDefault();
    LocalStorage.removeBooking(
      booking.service,
      booking.booking_date,
      booking.slot
    );
    setBookingList((prevState) => [
      ...prevState.filter(
        (b) =>
          b.service !== booking.service &&
          b.booking_date !== booking.booking_date &&
          b.slot !== booking.slot
      ),
    ]);
  };

  const handleRemoveAddon = (
    e: React.SyntheticEvent,
    addonId: number | undefined
  ) => {
    e.preventDefault();
    if (!selectedBooking || !addonId) return;
    LocalStorage.updateBooking(
      { id: selectedBooking.id },
      {
        addons: [
          ...new Set([...selectedBooking.addons.filter((a) => a !== addonId)]),
        ],
      }
    );
  };

  const handleProceedBooking = (e: React.SyntheticEvent) => {
    e.preventDefault();
    // Check user is logged in or not,
    // if not loggedin then redirect to login page
    if (!user) {
      router.push("/signin");
    } else {
      // If loggedin successfully then proceed with checkoout process
      router.push("/dashboard/checkout");
    }
    // Set a location for each task
    // A automatic detailer will be assigned to the task
  };

  const serviceMap = useMemo(() => {
    const services = new Map(
      combinedServices?.services.map((s) => [s.id || 0, s])
    );
    return services;
  }, [combinedServices]);

  const vehicleTypeMap: Map<number, IVehicleType> = useMemo(() => {
    if (!combinedServices?.vehicle_types) return new Map();
    return new Map(combinedServices.vehicle_types.map((vt) => [vt.id, vt]));
  }, [combinedServices?.vehicle_types]);

  const servicePriceMap = useMemo(() => {
    const map = new Map<number, number>();
    combinedServices?.services?.forEach((service) => {
      service.prices?.forEach((price) => {
        if (price?.id != null && price?.price != null) {
          map.set(price.id, Number(price.price));
        }
      });
    });
    return map;
  }, [combinedServices]);

  const calcServicePrice = useCallback(
    (booking: IBooking) => {
      if(!booking.service_price) return 0;
      const priceValue = servicePriceMap.get(booking.service_price);
      return priceValue != null && !isNaN(priceValue)
        ? priceValue
        : 0;
    },
    [servicePriceMap]
  );
  

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

  const { subTotal, totalPrice, tax } = useMemo(() => {
    // const serviceTotal = bookingList.reduce(
    //   (sum, b) =>
    //     sum +
    //     parseInt(
    //       String(
    //         serviceMap
    //           .get(b.service)
    //           ?.prices.find(
    //             (p) => p.vehicle_type === vehicleTypeMap.get(p.vehicle_type)?.id
    //           )?.price || "0"
    //       ),
    //       10
    //     ),
    //   0
    // );
    let serviceTotal = 0;
    bookingList.forEach((booking)=>{
      const bookingPrice = calcServicePrice(booking);
      serviceTotal += bookingPrice;
    })

    


    const addonTotal =
      addonServices?.reduce((sum, a) => sum + parseInt(a.price_min, 10), 0) ||
      0;

    const sub = serviceTotal + addonTotal;
    const tax =  (serviceTotal + addonTotal) * TAX;
    const total = tax + sub;
    return { subTotal: sub, totalPrice: total, tax };
  }, [bookingList, addonServices, serviceMap, vehicleTypeMap]);

  useEffect(() => {
    if (bookingList.length > 0) {
      setSelectedBooking(bookingList[0]);
    }
  }, [bookingList]);

  return (
    <div className="sticky-sidebar">
      <div className="card bbooking-0 shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            <i className="bi bi-cart-check me-2"></i> Your Selection
          </h5>
        </div>
        <div className="card-body">
          <div id="selectedPackage" className="mb-3">
            {bookingList.length === 0 ? (
              <p className="text-muted mb-2">No package selected yet</p>
            ) : (
              bookingList.map((booking) => (
                <div
                  key={booking.id}
                  className="w-100 d-flex justify-content-between align-items-center gap-2"
                >
                  <button
                    onClick={(e) => handleRemoveBooking(e, booking)}
                    className={`btn btn-transparent p-0 m-0 ${styles.removeBtn}`}
                  >
                    <CiSquareRemove className="text-danger" size={20} />
                  </button>

                  <p className={`text-muted p-0 m-0 ${styles.serviceName}`}>
                    {serviceMap.get(booking.service)?.title}
                  </p>
                  <p className={`text-muted p-0 m-0 ${styles.servicePrice} `}>
                    ${calcServicePrice(booking).toFixed(0)}
                  </p>
                </div>
              ))
            )}
          </div>

          <div id="selectedAddons" className="mb-3">
            <h6 className="fw-bold mb-2">Add-On Services</h6>
            <div id="addonsList" className="mb-2">
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
                        <button
                          onClick={(e) => handleRemoveAddon(e, addon.id)}
                          className={`btn btn-transparent p-0 m-0 ${styles.removeBtn}`}
                        >
                          <CiSquareRemove className="text-danger" size={20} />
                        </button>
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

          <div className="d-flex justify-content-between align-items-center mb-2">
            <span>Subtotal:</span>
            <strong id="subtotal">${subTotal}</strong>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span>Tax (8%):</span>
            <strong id="tax">${tax}</strong>
          </div>
          <div className="d-flex justify-content-between align-items-center fw-bold fs-5 bbooking-top pt-2">
            <span>Total:</span>
            <span id="total" className="text-primary">
              ${totalPrice}
            </span>
          </div>

          <button
            className="btn btn-primary w-100 mt-3"
            disabled={bookingList.length <= 0}
            onClick={handleProceedBooking}
            id="checkoutBtn"
          >
            Proceed to Booking
          </button>
        </div>
      </div>

      <div className="card bbooking-0 shadow-sm">
        <img
          src="/imgs/car-cleaning-discounts.jpg"
          className="card-img-top"
          alt="Car cleaning discounts"
          style={{ height: "180px", objectFit: "cover" }}
        />
        <div className="card-body text-center">
          <h5 className="card-title fw-bold text-primary">Special Discount</h5>
          <p className="card-text">
            Get 10% off when you book 2 or more add-on services!
          </p>

          <div className="bg-light p-3 rounded-3 mb-3">
            <i className="bi bi-telephone-fill text-primary fs-3 mb-2"></i>
            <h5 className="fw-bold mb-1">Need Help?</h5>
            <p className="text-muted small mb-2">
              Our detailing experts are standing by
            </p>
            <a href="tel:9876543210" className="btn btn-outline-primary w-100">
              <i className="bi bi-telephone me-2"></i> 987 654 3210
            </a>
          </div>

          <div className="alert alert-success">
            <h6 className="alert-heading fw-bold">
              <i className="bi bi-lightning-fill me-2"></i> Today's Special
            </h6>
            <p className="small mb-0">
              Free interior vacuum with any exterior package!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackageSelectionSidebar;

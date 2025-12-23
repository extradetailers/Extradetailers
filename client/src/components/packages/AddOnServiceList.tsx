"use client";
import { combinedServicesOptions } from "@/app/_requests/services";
import useBookingList from "@/hooks/useBookingList";
import { useMessage } from "@/lib/ToastProvider";
import { IBooking, TModuleStyle } from "@/types";
import LocalStorage from "@/utils/LocalStorage";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

interface IAddOnServiceListProps {
  styles: TModuleStyle;
}

function AddOnServiceList({ styles }: IAddOnServiceListProps) {
  const { setMessage } = useMessage();
  const [bookingList, setBookingList] = useBookingList();
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const { data: combinedServices } = useQuery(combinedServicesOptions);

  const handleSelectAddon = (
    e: React.SyntheticEvent,
    addonId: number | undefined
  ) => {
    e.preventDefault();
    if (!addonId) return;
    if (bookingList.length === 0 || !selectedBooking) {
      return setMessage({
        error: true,
        text: "You must select a main package in order to select any addon service!",
      });
    }
    // Update booking

    LocalStorage.updateBooking(
      {
        booking_date: selectedBooking.booking_date,
        slot: selectedBooking.slot,
        service: selectedBooking.service,
      },
      { addons: [...new Set([...selectedBooking.addons, addonId])] }
    );
  };

  useEffect(()=>{
    if (bookingList.length > 0) {
      const selectedBooking = bookingList[0];
      setSelectedBooking(selectedBooking);
    }
  }, [bookingList])

  return (
    <div className="tab-pane fade" id="addons" role="tabpanel">
      <div className="row g-4">
        {combinedServices?.addon_services &&
          combinedServices?.addon_services.map((addon) => (
            <div
              className="col-md-6"
              key={addon.id}
              role="presentation"
              onClick={(e) => handleSelectAddon(e, addon.id)}
            >
              <div className={`card ${(selectedBooking && addon.id && selectedBooking.addons.includes(addon.id)) ? "text-bg-primary" : ""} addon-card border h-100`}>
                <div className="card-body">
                  <div className="d-flex">
                    <div className="service-icon bg-primary bg-opacity-10 text-primary">
                      <i className="bi bi-brush-fill fs-4"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">{addon.name}</h5>
                      <p className="text-muted small mb-2">
                        {addon.description}
                      </p>
                      <span className="badge bg-primary price-badge">
                        ${addon.price_min} - ${addon.price_max}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default AddOnServiceList;

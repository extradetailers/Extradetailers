"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PackageCard from "./PackageCard";
import {
  EBookingStatus,
  IBooking,
  IService,
  IServicePopulated,
  IServicePrice,
  IVehicleType,
  TModuleStyle,
} from "@/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useQuery } from "@tanstack/react-query";
import {
  combinedServicesOptions,
  servicesOptions,
} from "@/app/_requests/services";
import LocalStorage from "@/utils/LocalStorage";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useMessage } from "@/lib/ToastProvider";
import useBookingList from "@/hooks/useBookingList";

interface IPackageListProps {
  styles: TModuleStyle;
}

const timeSlots = {
  Morning: ["9:00am", "10:00am", "11:00am"],
  Afternoon: ["12:00pm", "1:00pm", "2:00pm", "3:00pm", "4:00pm"],
  Evening: ["5:00pm"],
};

function PackageList({ styles }: IPackageListProps) {
  const {setMessage} = useMessage();
  const router = useRouter();

  const { data: combinedServices } = useQuery(combinedServicesOptions);
  const user = useUser();
  const [bookingList, setBookingList] = useBookingList();

  const modalEl = useRef(null);
  const [selectedService, setSelectedService] =
    useState<IServicePopulated | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState<number | null>(
    null
  );
  const [selectedPriceId, setSelectedPriceId] = useState<number | null>(null);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      import("bootstrap/dist/js/bootstrap.bundle.min.js").then((bootstrap) => {
        const modalElement = document.getElementById("packageModal");
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modalEl.current = modal;
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          selectedService ? modal.show() : modal.hide();
        }
      });
    }
  }, [selectedService]);


  const handleSelectPackage = (service: IServicePopulated) => {
    if(bookingList.length > 0){
      return setMessage({error: true, text: "Only one service can be selected at once! Complete the process before making any other booking!"});
    }
    setSelectedService(service);
  };

  const handleDateChange = (
    date: Date | null,
    event?: React.SyntheticEvent<unknown>
  ) => {
    event?.preventDefault();
    if (date) {
      // Set time to 00:00:00 while keeping the date
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);
      setSelectedDate(normalizedDate);
    }
    setSelectedTimeSlot(null);
  };

  const handleSelectTimeSlot = (slot: string) => {
    if (!selectedService || !selectedDate) return;
    setSelectedTimeSlot(slot);
  };

  const handleSelectVehiclePrice = (
    price: IServicePrice,
    vehicleType: IVehicleType | undefined
  ) => {
    if (price.id) setSelectedPriceId(price.id);
    if (vehicleType?.id) setSelectedVehicleType(vehicleType.id);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (modalEl.current) modalEl.current.hide();
  };

  const handleAddToCart = () => {
    if (selectedService && selectedDate && selectedTimeSlot) {
      
      const booking: IBooking = {
        service: selectedService.id || 0,
        booking_date: selectedDate.toISOString(),
        slot: selectedTimeSlot,

        // 3 new fields
        service_price: selectedPriceId,
        vehicle_type: selectedVehicleType,
        // location: 1
        addons: [],
      };

      // If user is logged in, add to cart and show checkout button
      setBookingList([...bookingList, booking]);
      LocalStorage.addBooking(booking);
      if (user) {
        setShowCheckout(true);
      } else {
        // @ts-ignore
        if (modalEl.current) modalEl.current.hide();
        // Show signin button
        // router.push("/signin");
      }
    }
  };

  const handleToggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Mapping
  const vehicleTypeMap: Map<number, IVehicleType> = useMemo(() => {
    if (!combinedServices?.vehicle_types) return new Map();
    return new Map(combinedServices.vehicle_types.map((vt) => [vt.id, vt]));
  }, [combinedServices?.vehicle_types]);

  return (
    <div className="tab-pane fade show active" id="packages" role="tabpanel">
      {combinedServices?.services.map((service, index) => (
        <PackageCard
          key={service.id}
          styles={styles}
          service={service}
          index={index}
          isActive={activeIndex === index}
          vehicleTypeMap={vehicleTypeMap}
          onSelect={handleSelectPackage}
          onToggle={() => handleToggleAccordion(index)}
        />
      ))}

      {/* <Bootstrap Modal Starts  */}
      <div
        className="modal fade"
        id="packageModal"
        tabIndex={-1}
        aria-labelledby="packageModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content shadow-lg rounded-3 bbooking-0">
            {/* Modal Header */}
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title fw-bold" id="packageModalLabel">
                Select a Date & Time for{" "}
                <span className="text-warning">{selectedService?.title}</span>
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={handleCloseModal}
                aria-label="Close"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body p-4">
              {/* Date Picker */}
              <div className="form-group">
                <label className="form-label fw-bold text-dark mb-2">
                  Choose a Date
                </label>
                <div className="d-flex justify-content-center">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    inline
                    locale="en"
                    className="form-control w-100"
                    wrapperClassName="w-100"
                    calendarClassName="bbooking rounded-3 shadow-sm p-2 bg-light"
                  />
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="mt-4">
                  <h5 className="fw-bold text-dark">Available Time Slots</h5>
                  {Object.entries(timeSlots).map(([period, slots]) => (
                    <div key={period} className="mt-2">
                      <h6 className="text-primary fw-bold">{period}</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {slots.map((slot) => (
                          <button
                            key={slot}
                            className={`btn ${
                              selectedTimeSlot === slot
                                ? "btn-success"
                                : "btn-outline-primary"
                            } fw-bold`}
                            onClick={() => handleSelectTimeSlot(slot)}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedTimeSlot && (
                <div className="mt-4">
                  <h5 className="fw-bold text-dark">Vehicle Pricing</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedService?.prices &&
                      selectedService?.prices.map((price) => (
                        <button
                          key={price.id}
                          className={`btn ${
                            selectedPriceId === price.id
                              ? "btn-success"
                              : "btn-outline-primary"
                          } fw-bold`}
                          onClick={() =>
                            handleSelectVehiclePrice(
                              price,
                              vehicleTypeMap.get(price.vehicle_type)
                            )
                          }
                        >
                          {vehicleTypeMap.get(price.vehicle_type)?.name} - $
                          {price.price}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer bg-light bbooking-top-0 d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-danger fw-bold px-4"
                onClick={handleCloseModal}
              >
                Remove
              </button>
              <button
                type="button"
                className="btn btn-primary fw-bold px-4"
                disabled={
                  !selectedDate || !selectedTimeSlot || !selectedTimeSlot
                }
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <Bootstrap Modal Ends  */}
    </div>
  );
}

export default PackageList;

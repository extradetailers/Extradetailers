"use client";

import useUser from "@/hooks/useUser";
import {
  EBookingStatus,
  EUserRole,
  IBooking,
  IBookingPopulated,
  IUser,
} from "@/types";
import { formatLocalDate } from "@/utils/datetime";
import { bookingStatuses } from "@/utils/staticData";
import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaUserTie,
  FaTags,
} from "react-icons/fa";

interface IBookingCardProps {
  booking: IBookingPopulated;
  styles: Record<string, string>;
  detailers: IUser[] | null | undefined;
  handleDeleteBooking: (e: React.SyntheticEvent, bookingId: number) => void;
  handleUpdateBooking: (
    e: React.SyntheticEvent,
    bookingId: number,
    updateObj: Record<string, any>
  ) => void;
}

function BookingCard({
  booking,
  styles,
  detailers,
  handleDeleteBooking,
  handleUpdateBooking,
}: IBookingCardProps) {
  const [selectedStatus, setSelectedStatus] = useState<EBookingStatus>(
    EBookingStatus.INITIALIZED
  );
  const [selectedDetailer, setSelectedDetailer] = useState<number>();
  // selectedDetailer
  const user = useUser();

  const setEditingBooking = (bookingId: number) => {
    console.log(bookingId);
  };

  const updateBooking = (e: React.SyntheticEvent, bookingId: number) => {
    // updateObj: Record<string, any>
    const inputEl = e.target as HTMLSelectElement;
    setSelectedStatus(inputEl.value as EBookingStatus);
    handleUpdateBooking(e, bookingId, {
      status: inputEl.value as EBookingStatus,
    });
  };

  const updateDetailerBooking = (e: React.SyntheticEvent, bookingId: number) => {
    // updateObj: Record<string, any>
    const inputEl = e.target as HTMLSelectElement;
    setSelectedDetailer(parseInt(inputEl.value, 10) as number);
    handleUpdateBooking(e, bookingId, {
      detailer: parseInt(inputEl.value, 10),
    });
  };

  const handleUpdateStatus = (e: React.SyntheticEvent) => {
    e.preventDefault();
    // (e)=> setSelectedStatus(e.target.value as EBookingStatus)
    const inputEl = e.target as HTMLSelectElement;
    setSelectedStatus(inputEl.value as EBookingStatus);
  };
  // Delete booking need to work properly with mutation
  // Create a next.js provider to handle error/display error in both server component and client component. Is it possible?
  // Error handling - https://nextjs.org/docs/app/building-your-application/routing/error-handling

  // Design this card brautifully, Follow UI/UX design principle, use bootstrap classes as much as possible, use icons to look beautiful (react icons)
  const totalPrice = (
    Number(booking.service_price?.price ?? 0) +
    booking.addons?.reduce(
      (total, addon) => total + Number(addon?.price_min ?? 0),
      0
    )
  ).toFixed(0);

  useEffect(() => {
    if (booking.status) setSelectedStatus(booking.status);
    if(booking.detailer?.id) setSelectedDetailer(booking.detailer?.id);
  }, [booking]);

  return (
    <div className={`card shadow-sm p-3 mb-4 ${styles.bookingCard}`}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5
          className="mb-0 text-primary text-truncate"
          title={booking.service?.title}
        >
          <FaTags className="me-1" />
          {booking?.service?.title}
        </h5>
        {user?.userRole !== EUserRole.ADMIN && (
          <span
            className={`badge rounded-pill text-uppercase ${
              booking.status === EBookingStatus.COMPLETED
                ? "bg-success"
                : "bg-warning text-dark"
            }`}
          >
            <FaCheckCircle className="me-1" />
            {booking.status}
          </span>
        )}
      </div>
      <div className="mb-2">
        {user?.userRole === EUserRole.ADMIN && (
          <select
            value={selectedStatus}
            onChange={(e) => updateBooking(e, booking.id || 0)}
            className="form-control"
          >
            {bookingStatuses.map((bs) => (
              <option key={bs} value={bs} className="text-uppercase">
                {bs}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Info */}
      <ul className="list-unstyled mb-3 small">
        <li className="mb-1">
          <FaCalendarAlt className="me-2 text-muted" />
          {formatLocalDate(booking.booking_date)}
        </li>
        <li className="mb-1">
          <FaClock className="me-2 text-muted" />
          Slot: {booking.slot}
        </li>
        <li className="mb-1">
          <FaUser className="me-2 text-muted" />
          Customer: {booking.customer.first_name} {booking.customer.last_name}
        </li>
        {user?.userRole === EUserRole.ADMIN ? (
          <div className="py-1">
            <label htmlFor="">Detailer</label>
            <select
              value={selectedDetailer}
              onChange={(e) => updateDetailerBooking(e, booking.id || 0)}
              className="form-control"
            >
              <option value="" className="text-uppercase">
                Select a detailer
              </option>
              {detailers &&
                detailers.map((d) => (
                  <option key={d.id} value={d.id} className="text-uppercase">
                    {`${d.first_name} ${d.last_name}`}
                  </option>
                ))}
            </select>
          </div>
        ) : (
          <li className="mb-1">
            <FaUserTie className="me-2 text-muted" />
            Detailer:{" "}
            {booking.detailer
              ? `${booking.detailer.first_name} ${booking.detailer.last_name}`
              : "Not Assigned"}
          </li>
        )}

        <li className="mb-1">
          <FaDollarSign className="me-2 text-muted" />
          Base Price: ${booking.service_price?.price}
        </li>
      </ul>

      {/* Addons */}
      {booking.addons.length > 0 && (
        <div className="mb-3">
          <strong className="d-block mb-1 text-secondary">Add-ons:</strong>
          <ul className="list-group list-group-flush small">
            {booking.addons.map((addon) => (
              <li
                className="list-group-item px-0 d-flex justify-content-between"
                key={addon.id}
              >
                <span>{addon.name}</span>
                <span>${addon.price_min}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Total + Actions */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <h6 className="mb-0 text-success">
          <FaDollarSign className="me-1" />
          Total: ${totalPrice}
        </h6>
        {user?.userRole === EUserRole.ADMIN && (
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => booking.id && setEditingBooking(booking.id)}
              title="Edit"
            >
              <FaEdit />
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={(e) => booking.id && handleDeleteBooking(e, booking.id)}
              title="Delete"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingCard;

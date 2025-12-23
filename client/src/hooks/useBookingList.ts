import { useEffect, useState } from "react";
import { IBooking } from "@/types";
import LocalStorage from "@/utils/LocalStorage";

const useBookingList = (): [IBooking[], React.Dispatch<React.SetStateAction<IBooking[]>>] => {
  const [bookingList, setBookingList] = useState<IBooking[]>([]);

  useEffect(() => {
    const bookings = LocalStorage.getBookings();
    setBookingList(bookings || []);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedBookings = LocalStorage.getBookings();
      setBookingList(updatedBookings || []);
    };

    window.addEventListener("add-booking", handleStorageChange);
    window.addEventListener("remove-booking", handleStorageChange);
    window.addEventListener("update-booking", handleStorageChange);

    return () => {
      window.removeEventListener("add-booking", handleStorageChange);
      window.removeEventListener("remove-booking", handleStorageChange);
      window.addEventListener("update-booking", handleStorageChange);
    };
  }, []);

  return [bookingList, setBookingList];
};

export default useBookingList;

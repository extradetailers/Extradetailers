// app/booking/page.tsx
import { bookingsOptions } from "@/app/_requests/bookings";
import styles from "./booking.module.scss";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import BookingList from "@/components/booking/BookingList";
import { useUsersOptions } from "@/app/_requests/users";
import { EUserRole } from "@/types";

async function BookingPage() {

  const queryClient = getQueryClient();

  try {
    // Always use await to properly handle errors
    await Promise.all([
      queryClient.prefetchQuery(bookingsOptions),
      queryClient.prefetchQuery(useUsersOptions({role: EUserRole.DETAILER}))
    ]);
  } catch (error) {
    console.error("Prefetch error:", error);
    // The error will automatically propagate to error.tsx
    throw error;
  }

  return (
    <div className={styles.bookingContainer}>
      <h1 className={styles.title}>Manage Bookings</h1>
      
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BookingList styles={styles} />
      </HydrationBoundary>
    </div>
  );
}

export default BookingPage;
import { bookingsOptions } from '@/app/_requests/bookings';
import { getQueryClient } from '@/lib/get-query-client';
import React from 'react';
import styles from './bookings.module.scss';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import BookingList from '@/components/booking/BookingList';

async function BookingsPage() {
  const queryClient = getQueryClient();

  try {
    // Always use await to properly handle errors
    await queryClient.prefetchQuery(bookingsOptions);
  } catch (error) {
    console.error("Prefetch error:", error);
    // The error will automatically propagate to error.tsx
    throw error;
  }

  return (
    <div>
      <h1 className={styles.title}>My Bookings</h1>
      
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BookingList styles={styles} />
      </HydrationBoundary>
    </div>
  )
}

export default BookingsPage;
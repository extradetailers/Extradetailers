'use client'

import { EUserRole, IBooking, IBookingPopulated } from '@/types';
import React, { useState } from 'react';
import BookingCard from './BookingCard';
import { DefaultError, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingsOptions, useDeleteBookingOptions, useUpdateBookingOptions } from '@/app/_requests/bookings';
import { useUsersOptions } from '@/app/_requests/users';
// import { useError } from '@/lib/ErrorProvider';


interface BookingListProps {
    styles: Record<string, string>;
}
function BookingList({ styles }: BookingListProps) {
    // const { setError } = useError();
    const queryClient = useQueryClient(); // ✅ React Query Client
    const { data: allBookings } = useQuery(bookingsOptions);
    const {data: detailerList} = useQuery(useUsersOptions({role: EUserRole.DETAILER}));
    // console.log({detailerList});
    

    // const [bookingId, setBookingId] = useState<number | null>(null);
    

    const deleteBookingMutation = useMutation<unknown, DefaultError, number>(useDeleteBookingOptions(queryClient));
    const updateBookingMutation = useMutation<unknown, DefaultError, { id: number; updateObj: Record<string, any> }>(useUpdateBookingOptions(queryClient));

    const handleUpdateBooking=(e: React.SyntheticEvent, bookingId: number, updateObj: Record<string, any>)=>{
        e.preventDefault();
        if(bookingId){
            updateBookingMutation.mutate({ id: bookingId, updateObj });
        }
        // setBookingId(null);
      }


    const handleDeleteBooking = async (e: React.SyntheticEvent, bookingId: number) => {
        e.preventDefault();
        await deleteBookingMutation.mutate(bookingId);
    }

    if (deleteBookingMutation.isPending) return <div>Loading</div>;

    

    return (
        <div className="d-flex flex-wrap gap-2 mt-3">
            {/* <button onClick={() => setError('Something went wrong!')}>
                Trigger Error
            </button> */}

            {allBookings && allBookings.length > 0 
            ? allBookings.map((booking: IBookingPopulated) => (
                <BookingCard key={booking.id} booking={booking} styles={styles} 
                detailers={detailerList}
                handleDeleteBooking={handleDeleteBooking} handleUpdateBooking={handleUpdateBooking} />
            ))
        : <div className='alert alert-primary'>You have no bookings</div>}
        </div>
    )
}

export default BookingList;
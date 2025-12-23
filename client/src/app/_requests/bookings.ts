import axiosInstance from "@/config/axios";
import { useMessage } from "@/lib/ToastProvider";
import { IAPIError, IBooking, IBookingPopulated } from "@/types";
import { handleApiError } from "@/utils/handleError";
import { cleanFormData } from "@/utils/helpers";
import { QueryClient } from "@tanstack/react-query";

export const bookingsOptions = {
  queryKey: ["bookings"] as const,
  queryFn: async (): Promise<IBookingPopulated[]> => {
    try {
      const response = await axiosInstance.get("/bookings/");
      
      return response.data;
      // @ts-ignore
    } catch (error: IAPIError) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage)

    }
  },
};

interface IUpdateBookingProps {
  id: number;
  updateObj: Record<string, any>;
}

async function updateBooking({ id, updateObj }: IUpdateBookingProps) {
  // const cleanedFormData = cleanFormData(formData);
  const response = await axiosInstance.put(
    `/bookings/${id}/update/`,
    updateObj,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export function useUpdateBookingOptions(
  queryClient: QueryClient
): Record<string, unknown> {
  const { setMessage } = useMessage();
  return {
    mutationFn: updateBooking,
    onSuccess: () => {
      console.log("Booking updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error: never) => {
      console.error("update Booking Error:", error);
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  };
}

async function deleteBooking(serviceId: number) {
  const response = await axiosInstance.delete(`/bookings/${serviceId}/delete/`);
  return response.data;
}

export function useDeleteBookingOptions(queryClient: QueryClient): Record<string, unknown> {
  const { setMessage } = useMessage();
  return {
    mutationFn: deleteBooking,
    onSuccess: () => {
      console.log("Booking deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] }); // ✅ Refetch bookings list
    },
    onError: (error: never) => {
      console.error("Create Booking Error:", error);
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  }
}

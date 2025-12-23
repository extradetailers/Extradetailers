import axiosInstance from "@/config/axios";
import { useMessage } from "@/lib/ToastProvider";
import { IBooking, IPaymentIntentResponse } from "@/types";
import { handleApiError } from "@/utils/handleError";
import { ApiError } from "next/dist/server/api-utils";

export async function createPaymentIntent(
  bookings: IBooking[]
): Promise<IPaymentIntentResponse> {
  const response = await axiosInstance.post(
    `/payments/create-payment-intent/`,
    { bookings }
  );
  return response.data;
}

export function useCreatePaymentIntentOptions() {
  const { setMessage } = useMessage();

  return {
    mutationFn: createPaymentIntent,
    onSuccess: (data: { clientSecret: string }) => {
      console.log("Payment intent created successfully!", data);
    },
    onError: (error: ApiError) => {
      console.error("Create Payment Error:", error);
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  };
}



export async function confirmPaymentIntent(
  bookings: IBooking[]
): Promise<IPaymentIntentResponse> {
  const response = await axiosInstance.post(
    `/payments/confirm-payment-intent/`,
    { bookings }
  );
  return response.data;
}

export function useConfirmPaymentIntentOptions() {
  const { setMessage } = useMessage();

  return {
    mutationFn: confirmPaymentIntent,
    onSuccess: (data: { clientSecret: string }) => {
      console.log("Payment intent confirmed successfully!", data);
    },
    onError: (error: ApiError) => {
      console.error("Confirm Payment Error:", error);
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  };
}

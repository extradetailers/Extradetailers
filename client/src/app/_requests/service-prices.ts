import axiosInstance from "@/config/axios";
import { useMessage } from "@/lib/ToastProvider";
import { IServicePrice } from "@/types";
import { handleApiError } from "@/utils/handleError";
import { cleanFormData } from "@/utils/helpers";
import { QueryClient } from "@tanstack/react-query";


export const servicePricesOptions = {
  queryKey: ["servicePrices"],
  queryFn: async (): Promise<IServicePrice[]> => {
    try {
      const response = await axiosInstance.get("/services/prices/");
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      throw new Error(error?.response?.data?.message || "Failed to fetch servicePrices.");
    }
  },
};



async function createServicePrice(formData: FormData) {
  const response = await axiosInstance.post("/services/prices/create/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });
  return response.data;
}

export function useCreateServicePriceOptions(queryClient: QueryClient): Record<string, unknown>{
    const { setMessage } = useMessage();
  return {
          mutationFn: createServicePrice,
          onSuccess: () => {
              console.log("ServicePrice created successfully!");
              queryClient.invalidateQueries({ queryKey: ["servicePrices"] }); // ✅ Refetch servicePrices list
          },
          onError: (error: never) => {
              console.error("Create ServicePrice Error:", error);
              const errorMessage = handleApiError(error);
              setMessage({ error: true, text: errorMessage });
          },
      }
}


interface IUpdateServicePriceProps {
  id: number;
  formData: FormData;
}

async function updateServicePrice({ id, formData }: IUpdateServicePriceProps) {
  const cleanedFormData = cleanFormData(formData);
  const response = await axiosInstance.put(
    `/services/prices/${id}/update/`,
    cleanedFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export function useUpdateServicePriceOptions(
  queryClient: QueryClient
): Record<string, unknown> {
  const { setMessage } = useMessage();
  return {
    mutationFn: updateServicePrice,
    onSuccess: () => {
      console.log("ServicePrice updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["servicePrices"] }); // ✅ Refetch servicePrices list
    },
    onError: (error: never) => {
      console.error("update ServicePrice Error:", error);
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  };
}



async function deleteServicePrice(addOnServiceId: number) {
  const response = await axiosInstance.delete(`/services/prices/${addOnServiceId}/delete/`);
  return response.data;
}

export function deleteServicePriceOptions(queryClient: QueryClient): Record<string, unknown>{
  return {
          mutationFn: deleteServicePrice,
          onSuccess: () => {
              console.log("ServicePrice deleted successfully!");
              queryClient.invalidateQueries({ queryKey: ["servicePrices"] }); // ✅ Refetch servicePrices list
          },
          onError: (error: never) => {
              console.error("Create ServicePrice Error:", error);
          },
      }
}
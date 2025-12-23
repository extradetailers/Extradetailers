import axiosInstance from "@/config/axios";
import { useMessage } from "@/lib/ToastProvider";
import { IAddOnService } from "@/types";
import { handleApiError } from "@/utils/handleError";
import { cleanFormData } from "@/utils/helpers";
import { QueryClient } from "@tanstack/react-query";

export const addOnServicesOptions = {
  queryKey: ["addOnServices"],
  queryFn: async (): Promise<IAddOnService[]> => {
    try {
      const response = await axiosInstance.get("/services/addons/");
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      throw new Error(
        // @ts-ignore
        error?.response?.data?.message || "Failed to fetch addOnServices."
      );
    }
  },
};

async function createAddOnService(formData: FormData) {
  const response = await axiosInstance.post(
    "/services/addons/create/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export function useCreateAddOnServiceOptions(
  queryClient: QueryClient
): Record<string, unknown> {
  const { setMessage } = useMessage();
  return {
    mutationFn: createAddOnService,
    onSuccess: () => {
      console.log("AddOnService created successfully!");
      queryClient.invalidateQueries({ queryKey: ["addOnServices"] }); // ✅ Refetch addOnServices list
    },
    onError: (error: never) => {
      console.error("Create AddOnService Error:", error);
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  };
}



interface IUpdateAddOnServiceProps {
  id: number;
  formData: FormData;
}

async function updateAddOnService({ id, formData }: IUpdateAddOnServiceProps) {
  const cleanedFormData = cleanFormData(formData);
  const response = await axiosInstance.put(
    `/services/addons/${id}/update/`,
    cleanedFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export function useUpdateAddOnServiceOptions(
  queryClient: QueryClient
): Record<string, unknown> {
  const { setMessage } = useMessage();
  return {
    mutationFn: updateAddOnService,
    onSuccess: () => {
      console.log("AddOnService updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["addOnServices"] }); // ✅ Refetch addOnServices list
    },
    onError: (error: never) => {
      console.error("update AddOnService Error:", error);
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  };
}

async function deleteAddOnService(addOnServiceId: number) {
  const response = await axiosInstance.delete(
    `/services/addons/${addOnServiceId}/delete/`
  );
  return response.data;
}

export function deleteAddOnServiceOptions(
  queryClient: QueryClient
): Record<string, unknown> {
  return {
    mutationFn: deleteAddOnService,
    onSuccess: () => {
      console.log("AddOnService deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["addOnServices"] }); // ✅ Refetch addOnServices list
    },
    onError: (error: never) => {
      console.error("Create AddOnService Error:", error);
    },
  };
}

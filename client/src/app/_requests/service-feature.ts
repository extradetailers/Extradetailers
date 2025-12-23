import axiosInstance from "@/config/axios";
import { useMessage } from "@/lib/ToastProvider";
import { IServiceFeature } from "@/types";
import { handleApiError } from "@/utils/handleError";
import { cleanFormData } from "@/utils/helpers";
import { QueryClient } from "@tanstack/react-query";

export const serviceFeaturesOptions = {
  queryKey: ["serviceFeatures"],
  queryFn: async (): Promise<IServiceFeature[]> => {
    try {
      const response = await axiosInstance.get("/services/features/");
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      throw new Error(
        // @ts-ignore
        error?.response?.data?.message || "Failed to fetch serviceFeatures."
      );
    }
  },
};

async function createServiceFeature(formData: FormData) {
  const response = await axiosInstance.post(
    "/services/features/create/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export function useCreateServiceFeatureOptions(
  queryClient: QueryClient
): Record<string, unknown> {
  const { setMessage } = useMessage();
  return {
    mutationFn: createServiceFeature,
    onSuccess: () => {
      console.log("ServiceFeature created successfully!");
      queryClient.invalidateQueries({ queryKey: ["serviceFeatures"] }); // ✅ Refetch serviceFeatures list
    },
    onError: (error: never) => {
      console.error("Create ServiceFeature Error:", error);
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  };
}



interface IUpdateServiceFeatureProps {
  id: number;
  formData: FormData;
}

async function updateServiceFeature({ id, formData }: IUpdateServiceFeatureProps) {
  const cleanedFormData = cleanFormData(formData);
  const response = await axiosInstance.put(
    `/services/features/${id}/update/`,
    cleanedFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export function useUpdateServiceFeatureOptions(
  queryClient: QueryClient
): Record<string, unknown> {
  const { setMessage } = useMessage();
  return {
    mutationFn: updateServiceFeature,
    onSuccess: () => {
      console.log("ServiceFeature updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["serviceFeatures"] }); // ✅ Refetch serviceFeatures list
    },
    onError: (error: never) => {
      console.error("update ServiceFeature Error:", error);
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  };
}

async function deleteServiceFeature(serviceFeatureId: number) {
  const response = await axiosInstance.delete(
    `/services/features/${serviceFeatureId}/delete/`
  );
  return response.data;
}

export function deleteServiceFeatureOptions(
  queryClient: QueryClient
): Record<string, unknown> {
  return {
    mutationFn: deleteServiceFeature,
    onSuccess: () => {
      console.log("ServiceFeature deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["serviceFeatures"] }); // ✅ Refetch serviceFeatures list
    },
    onError: (error: never) => {
      console.error("Create ServiceFeature Error:", error);
    },
  };
}

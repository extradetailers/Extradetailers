import axiosInstance from "@/config/axios";
import { useMessage } from "@/lib/ToastProvider";
import {
  IAddOnService,
  IAddOnServicePopulated,
  IAPIError,
  IService,
  IServiceCategory,
  IServiceFeature,
  IServicePopulated,
  IServicePrice,
  IVehicleType,
} from "@/types";
import { handleApiError } from "@/utils/handleError";
import { cleanFormData } from "@/utils/helpers";
import { QueryClient } from "@tanstack/react-query";

interface IServiceFullData {
  services: IService[];
  vehicle_types: IVehicleType[];
  service_categories: IServiceCategory[];
  service_prices: IServicePrice[];
  service_features: IServiceFeature[];
  addon_services: IAddOnService[];
  /*

  service_categories: IServiceCategory[];
  service_prices: IServicePrice[];
  service_features: IServiceFeature[];
  */
}

const servicesFullData = async (): Promise<IServiceFullData> => {
  try {
    const response = await axiosInstance.get("/services/full-data/");
    return response.data;
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    throw new Error(
      // @ts-ignore
      error?.response?.data?.message || "Failed to fetch services."
    );
  }
};

export const serviceFullDataOptions = {
  queryKey: ["servicesFullData"],
  queryFn: servicesFullData,
};

interface ICombinedServices{
  services: IServicePopulated[];
  addon_services: IAddOnServicePopulated[];
  vehicle_types: IVehicleType[];
}

const getCombinedServices = async (): Promise<ICombinedServices> => {
  try {
    const response = await axiosInstance.get("/services/combined-data/");
    return response.data;
  } catch (error: unknown) {
    throw new Error(
      // @ts-ignore
      error?.response?.data?.message || "Failed to fetch services."
    );
  }
}

export const combinedServicesOptions = {
  queryKey: ["combinedServices"],
  queryFn: getCombinedServices,
};


export const servicesOptions = {
  queryKey: ["services"],
  queryFn: async (): Promise<IService[]> => {
    try {
      const response = await axiosInstance.get("/services/main/");
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      throw new Error(
        // @ts-ignore
        error?.response?.data?.message || "Failed to fetch services."
      );
    }
  },
};

async function createService(formData: FormData) {
  const response = await axiosInstance.post("/services/main/create/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export function useCreateServiceOptions(
  queryClient: QueryClient
): Record<string, unknown> {
  const { setMessage } = useMessage();
  return {
    mutationFn: createService,
    onSuccess: () => {
      console.log("Service created successfully!");
      queryClient.invalidateQueries({ queryKey: ["services", "servicesFullData"] }); // ✅ Refetch services list
    },
    onError: (error: never) => {
      console.error("Create Service Error:", error);
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  };
}

// useUpdateServiceOptions
interface IUpdateServiceProps {
  id: number;
  formData: FormData;
}

async function updateService({ id, formData }: IUpdateServiceProps) {
  const cleanedFormData = cleanFormData(formData);
  const response = await axiosInstance.put(
    `/services/main/${id}/update/`,
    cleanedFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export function useUpdateServiceOptions(
  queryClient: QueryClient
): Record<string, unknown> {
  const { setMessage } = useMessage();
  return {
    mutationFn: updateService,
    onSuccess: () => {
      console.log("Service updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["servicesFullData"] });
    },
    onError: (error: never) => {
      console.error("update Service Error:", error);
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  };
}



// Delete
async function deleteService(serviceId: number) {
  const response = await axiosInstance.delete(`/services/${serviceId}/delete/`);
  return response.data;
}

export function deleteServiceOptions(
  queryClient: QueryClient
): Record<string, unknown> {
  return {
    mutationFn: deleteService,
    onSuccess: () => {
      console.log("Service deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["services", "servicesFullData"] }); // ✅ Refetch services list
    },
    onError: (error: never) => {
      console.error("Create Service Error:", error);
    },
  };
}

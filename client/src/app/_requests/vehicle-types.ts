import axiosInstance from "@/config/axios";
import { useMessage } from "@/lib/ToastProvider";
import { IVehicleType } from "@/types";
import { handleApiError } from "@/utils/handleError";
import { cleanFormData } from "@/utils/helpers";
import { QueryClient } from "@tanstack/react-query";


export const vehicleTypesOptions = {
  queryKey: ["vehicleTypes"],
  queryFn: async (): Promise<IVehicleType[]> => {
    try {
      const response = await axiosInstance.get("/services/vehicle-types/");
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      throw new Error(
        // @ts-ignore
        error?.response?.data?.message || "Failed to fetch vehicleTypes."
      );
    }
  },
};

async function createVehicleType(formData: FormData) {
  const response = await axiosInstance.post(
    "/services/vehicle-types/create/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export function useCreateVehicleTypeOptions(
  queryClient: QueryClient
): Record<string, unknown> {
  const { setMessage } = useMessage();
  return {
    mutationFn: createVehicleType,
    onSuccess: () => {
      console.log("VehicleType created successfully!");
      queryClient.invalidateQueries({ queryKey: ["vehicleTypes"] }); // ✅ Refetch vehicleTypes list
    },
    onError: (error: never) => {
      console.error("Create VehicleType Error:", error);
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  };
}



interface IUpdateVehicleTypeProps {
  id: number;
  formData: FormData;
}

async function updateVehicleType({ id, formData }: IUpdateVehicleTypeProps) {
  const cleanedFormData = cleanFormData(formData);
  const response = await axiosInstance.put(
    `/services/vehicle-types/${id}/update/`,
    cleanedFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export function useUpdateVehicleTypeOptions(
  queryClient: QueryClient
): Record<string, unknown> {
  const { setMessage } = useMessage();
  return {
    mutationFn: updateVehicleType,
    onSuccess: () => {
      console.log("VehicleType updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["vehicleTypes"] }); // ✅ Refetch vehicleTypes list
    },
    onError: (error: never) => {
      console.error("update VehicleType Error:", error);
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  };
}

async function deleteVehicleType(vehicleTypeId: number) {
  const response = await axiosInstance.delete(
    `/services/vehicle-types/${vehicleTypeId}/delete/`
  );
  return response.data;
}

export function deleteVehicleTypeOptions(
  queryClient: QueryClient
): Record<string, unknown> {
  return {
    mutationFn: deleteVehicleType,
    onSuccess: () => {
      console.log("VehicleType deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["vehicleTypes"] }); // ✅ Refetch vehicleTypes list
    },
    onError: (error: never) => {
      console.error("Create VehicleType Error:", error);
    },
  };
}

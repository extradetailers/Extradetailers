import axiosInstance from "@/config/axios";
import { useMessage } from "@/lib/ToastProvider";
import {
  IUser,
} from "@/types";
import { handleApiError } from "@/utils/handleError";
import { cleanFormData } from "@/utils/helpers";
import { QueryClient } from "@tanstack/react-query";



export const getUsers = async (params: Record<string, any> = {}): Promise<IUser[]> => {
  try {
    const response = await axiosInstance.get("/accounts/main/", { params });
    return response.data;
  } catch (error: unknown) {
    throw new Error(
      // @ts-ignore
      error?.response?.data?.message || "Failed to fetch users."
    );
  }
};




export const useUsersOptions = (params: Record<string, any> = {}) => ({
  queryKey: ["users", params],
  queryFn: () => getUsers(params),
});


async function createUser(formData: FormData) {
  const response = await axiosInstance.post("/accounts/main/create/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export function useCreateUserOptions(
  queryClient: QueryClient
): Record<string, unknown> {
  const { setMessage } = useMessage();
  return {
    mutationFn: createUser,
    onSuccess: () => {
      console.log("User created successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] }); // ✅ Refetch users list
    },
    onError: (error: never) => {
      console.error("Create User Error:", error);
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  };
}

// useUpdateUserOptions
interface IUpdateUserProps {
  id: number;
  formData: FormData;
}

async function updateUser({ id, formData }: IUpdateUserProps) {
  const cleanedFormData = cleanFormData(formData);
  const response = await axiosInstance.put(
    `/accounts/main/${id}/update/`,
    cleanedFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export function useUpdateUserOptions(
  queryClient: QueryClient
): Record<string, unknown> {
  const { setMessage } = useMessage();
  return {
    mutationFn: updateUser,
    onSuccess: () => {
      console.log("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: never) => {
      console.error("update User Error:", error);
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  };
}



// Delete
async function deleteUser(userId: number) {
  const response = await axiosInstance.delete(`/accounts/main/${userId}/delete/`);
  return response.data;
}

export function useDeleteUserOptions(
  queryClient: QueryClient
): Record<string, unknown> {
  const { setMessage } = useMessage();
  return {
    mutationFn: deleteUser,
    onSuccess: () => {
      console.log("User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] }); // ✅ Refetch users list
    },
    onError: (error: never) => {
      console.error("Create User Error:", error);
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  };
}

import axiosInstance from "@/config/axios";
import { useMessage } from "@/lib/ToastProvider";
import { handleApiError } from "@/utils/handleError";
import LocalStorage from "@/utils/LocalStorage";
// import { useRouter } from 'next/navigation';
// import { QueryClient } from "@tanstack/react-query";

export const signoutUser = async (userData: FormData) => {
  const response = await axiosInstance.post("/accounts/logout/", userData);
  return response.data;
};

export const signupUser = async (userData: FormData) => {
  const response = await axiosInstance.post("/accounts/signup/", userData);
  return response.data;
};

export const signinUser = async (userData: FormData) => {
  const response = await axiosInstance.post("/accounts/login/", userData);
  return response.data;
};


// Server component 
export async function validateUser(token?: string) {
  if (!token) {
    return {
      message: "❌ Invalid request. No token provided.",
      isError: true,
    };
  }

  try {
    const response = await axiosInstance.post(`/accounts/validate-user/`, { token });

    if (response.status === 200) {
      // Success, trigger redirection after a message
      return {
        message: "✅ User successfully validated! Redirecting...",
        isError: false,
      };
    }

    return {
      message: "❌ Unexpected response. Please try again.",
      isError: true,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  } catch (error: never) {
    console.error("Validation failed:", error.response?.data || error.message);

    let errorMessage = "An unknown error occurred. Please try again.";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = "❌ Invalid or expired token. Please try again.";
      } else if (error.response.status === 500) {
        errorMessage = "⚠️ Server error. Please try again later.";
      }
    }

    return {
      message: errorMessage,
      isError: true,
    };
  }
}

export async function refreshAccessToken() {
  const response = await axiosInstance.post("/accounts/refresh-token/");
  return response.data;
}


export function useSigninOptions(): Record<string, unknown> {
  const { setMessage } = useMessage();
  // const router = useRouter(); // Initialize Next.js router
  

  return {
    mutationFn: signinUser,
    onSuccess: (data: unknown) => {
      // Set data to local storage
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      LocalStorage.setUser(data?.access_token || null, data?.user_role || null);
      // router.push("/dashboard");
      if(window !== undefined){
        window.location.href = "/dashboard";
      }
    },
    onError: (error: never) => {
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  }
};

export function useSignupOptions(): Record<string, unknown> {
  const { setMessage } = useMessage();

  return {
    mutationFn: signupUser,
    onSuccess: () => {
      console.log("Signup successfully!");
      // Delete local cookie
      // Delete data from local storage 
      LocalStorage.removeUser();
      setMessage({ error: false, text: "Signup successfully! An email is been sent, click the link in order to validate your email!" });
    },
    onError: (error: never) => {
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  }
};


export function useSignoutOptions(): Record<string, unknown> {
  const { setMessage } = useMessage();
  // const router = useRouter(); // Initialize Next.js router

  return {
    mutationFn: signoutUser,
    onSuccess: (data: unknown) => {
      console.log("Signout successfully!", data);
      LocalStorage.removeUser();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setMessage({ error: false, text: data?.message || "Signout successfully!" });
      // router.push("/signin");
      if(window !== undefined){
        window.location.href = "/signin";
      }
    },
    onError: (error: never) => {
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  }
};


export const passwordForgotten = async (userData: FormData) => {
  const response = await axiosInstance.post("/accounts/forgot-password/", userData);
  return response.data;
};

export function usePasswordForgottenOptions(): Record<string, unknown> {
  const { setMessage } = useMessage();
  // const router = useRouter(); // Initialize Next.js router

  return {
    mutationFn: passwordForgotten,
    onSuccess: (data: unknown) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setMessage({ error: false, text: data?.message || "Sent Validation code via email successfully!" });
    },
    onError: (error: never) => {
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  }
};


export const resetPassword = async (userData: FormData) => {
  const response = await axiosInstance.post("/accounts/reset-password/", userData);
  return response.data;
};

export function useResetPasswordOptions(): Record<string, unknown> {
  const { setMessage } = useMessage();
  // const router = useRouter(); // Initialize Next.js router

  return {
    mutationFn: resetPassword,
    onSuccess: (data: unknown) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setMessage({ error: false, text: data?.message || "Password reset successfully!" });
    },
    onError: (error: never) => {
      const errorMessage = handleApiError(error);
      setMessage({ error: true, text: errorMessage });
    },
  }
};
import { IAPIError } from "@/types";
import { AxiosError } from "axios";

export function handleApiError(error: IAPIError): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const responseData = error.response?.data;

    // Handle field-specific errors (like the price example)
    if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
      const fieldErrors = Object.entries(responseData)
        .filter(([_, value]) => Array.isArray(value) || typeof value === 'string')
        .map(([field, messages]) => {
          if (Array.isArray(messages)) {
            return `${field}: ${messages.join(', ')}`;
          }
          return `${field}: ${messages}`;
        });

      if (fieldErrors.length > 0) {
        return `Error ${status}:\n${fieldErrors.join('\n')}`;
      }
    }

    // Handle standard error messages
    const errorMessage = responseData?.detail || responseData?.error || responseData?.message || error.message;

    if (errorMessage) {
      return `Error ${status}: ${errorMessage}`;
    }

    // Fallback to status code messages
    switch (status) {
      case 400:
        return "Error 400: Bad Request - Please check your input.";
      case 401:
        return "Error 401: Unauthorized - Invalid credentials or session expired.";
      case 403:
        return "Error 403: Forbidden - You don't have permission.";
      case 404:
        return "Error 404: Not Found - The requested resource does not exist.";
      case 500:
        return "Error 500: Server Error - Please try again later.";
      default:
        return `Error ${status || "Unknown"}: An unexpected error occurred.`;
    }
  }

  return "An unexpected error occurred. Please try again.";
}
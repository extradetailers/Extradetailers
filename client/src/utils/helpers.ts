export function cleanFormData(formData: FormData): FormData {
    const cleanedFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      if (value !== null && value !== undefined && value !== '') {
        cleanedFormData.append(key, value);
      }
    }
    return cleanedFormData;
  }
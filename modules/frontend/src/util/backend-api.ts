import { UploadImageSuccessResult } from "@ekkusi/zen-tracking-backend/lib/types/restApiResponses";

const backendApiBaseUrl = process.env.REACT_APP_BACKEND_API_BASE_URL || "";

export const uploadImage = async (
  image: File
): Promise<UploadImageSuccessResult> => {
  const formData = new FormData();
  formData.append("photo", image);
  const response = await fetch(`${backendApiBaseUrl}/upload-image`, {
    method: "POST",
    body: formData,
  });
  const data: UploadImageSuccessResult = await response.json();
  return data;
};

export const deleteImage = async (fileUrl: string) => {
  const formData = new FormData();
  formData.append("fileName", fileUrl);
  await fetch(`${backendApiBaseUrl}/delete-image`, {
    method: "POST",
    body: formData,
  });
};

import api from "./axios";

export interface Upload {
  id: string;
  original_filename: string;
  stored_filename: string;
  file_path: string;
  content_type: string | null;
  file_size: number;
  created_at: string;
}

export const getUploads = async (): Promise<Upload[]> => {
  const response = await api.get<Upload[]>("/uploads");

  return response.data;
};

export const uploadFile = async (
  file: File,
): Promise<Upload> => {
  const formData = new FormData();

  formData.append("file", file, file.name);

  const response = await api.post<Upload>(
    "/uploads",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
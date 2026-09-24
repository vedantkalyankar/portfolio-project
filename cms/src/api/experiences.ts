import api from "./axios";

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExperienceCreateRequest {
  company: string;
  role: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface ExperienceUpdateRequest {
  company?: string;
  role?: string;
  location?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
}

export const getExperiences = async (): Promise<Experience[]> => {
  const response = await api.get<Experience[]>("/experiences");

  return response.data;
};

export const getExperience = async (
  id: string,
): Promise<Experience> => {
  const response = await api.get<Experience>(
    `/experiences/${id}`,
  );

  return response.data;
};

export const createExperience = async (
  data: ExperienceCreateRequest,
): Promise<Experience> => {
  const response = await api.post<Experience>(
    "/experiences",
    data,
  );

  return response.data;
};

export const updateExperience = async (
  id: string,
  data: ExperienceUpdateRequest,
): Promise<Experience> => {
  const response = await api.patch<Experience>(
    `/experiences/${id}`,
    data,
  );

  return response.data;
};

export const deleteExperience = async (
  id: string,
): Promise<void> => {
  await api.delete(`/experiences/${id}`);
};
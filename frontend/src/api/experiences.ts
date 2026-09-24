import api from "./axios";

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export const getExperiences = async (): Promise<Experience[]> => {
  const response = await api.get<Experience[]>("/experiences");

  return response.data;
};
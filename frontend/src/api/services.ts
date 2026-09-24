import api from "./axios";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export const getServices = async (): Promise<Service[]> => {
  const response = await api.get<Service[]>("/services");

  return response.data;
};
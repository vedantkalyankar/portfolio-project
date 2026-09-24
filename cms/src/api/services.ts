import api from "./axios";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceCreateRequest {
  title: string;
  description: string;
  icon: string;
}

export interface ServiceUpdateRequest {
  title?: string;
  description?: string;
  icon?: string;
}

export const getServices = async (): Promise<Service[]> => {
  const response = await api.get<Service[]>("/services");

  return response.data;
};

export const getService = async (
  id: string,
): Promise<Service> => {
  const response = await api.get<Service>(
    `/services/${id}`,
  );

  return response.data;
};

export const createService = async (
  data: ServiceCreateRequest,
): Promise<Service> => {
  const response = await api.post<Service>(
    "/services",
    data,
  );

  return response.data;
};

export const updateService = async (
  id: string,
  data: ServiceUpdateRequest,
): Promise<Service> => {
  const response = await api.patch<Service>(
    `/services/${id}`,
    data,
  );

  return response.data;
};

export const deleteService = async (
  id: string,
): Promise<void> => {
  await api.delete(`/services/${id}`);
};
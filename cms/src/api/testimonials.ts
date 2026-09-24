import api from "./axios";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface TestimonialCreateRequest {
  name: string;
  role: string;
  company: string;
  content: string;
}

export interface TestimonialUpdateRequest {
  name?: string;
  role?: string;
  company?: string;
  content?: string;
}

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const response = await api.get<Testimonial[]>("/testimonials");

  return response.data;
};

export const getTestimonial = async (
  id: string,
): Promise<Testimonial> => {
  const response = await api.get<Testimonial>(
    `/testimonials/${id}`,
  );

  return response.data;
};

export const createTestimonial = async (
  data: TestimonialCreateRequest,
): Promise<Testimonial> => {
  const response = await api.post<Testimonial>(
    "/testimonials",
    data,
  );

  return response.data;
};

export const updateTestimonial = async (
  id: string,
  data: TestimonialUpdateRequest,
): Promise<Testimonial> => {
  const response = await api.patch<Testimonial>(
    `/testimonials/${id}`,
    data,
  );

  return response.data;
};

export const deleteTestimonial = async (
  id: string,
): Promise<void> => {
  await api.delete(`/testimonials/${id}`);
};
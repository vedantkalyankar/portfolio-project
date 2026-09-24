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

export const getTestimonials = async (): Promise<
  Testimonial[]
> => {
  const response = await api.get<Testimonial[]>(
    "/testimonials",
  );

  return response.data;
};
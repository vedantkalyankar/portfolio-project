import api from "./axios";

export interface About {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  github_url: string;
  linkedin_url: string;
  created_at: string;
  updated_at: string;
}

export const getAbout = async (): Promise<About> => {
  const response = await api.get<About>("/about");

  return response.data;
};
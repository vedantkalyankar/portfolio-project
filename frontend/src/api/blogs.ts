import api from "./axios";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export const getBlogs = async (): Promise<Blog[]> => {
  const response = await api.get<Blog[]>("/blogs");

  return response.data;
};

export const getBlogById = async (
  id: string,
): Promise<Blog> => {
  const response = await api.get<Blog>(
    `/blogs/${id}`,
  );

  return response.data;
};
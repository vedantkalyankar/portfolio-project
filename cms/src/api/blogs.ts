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

export interface BlogCreateRequest {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
}

export interface BlogUpdateRequest {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  published?: boolean;
}

export const getBlogs = async (): Promise<Blog[]> => {
  const response = await api.get<Blog[]>("/blogs");

  return response.data;
};

export const getBlog = async (id: string): Promise<Blog> => {
  const response = await api.get<Blog>(`/blogs/${id}`);

  return response.data;
};

export const createBlog = async (
  data: BlogCreateRequest,
): Promise<Blog> => {
  const response = await api.post<Blog>("/blogs", data);

  return response.data;
};

export const updateBlog = async (
  id: string,
  data: BlogUpdateRequest,
): Promise<Blog> => {
  const response = await api.patch<Blog>(
    `/blogs/${id}`,
    data,
  );

  return response.data;
};

export const deleteBlog = async (
  id: string,
): Promise<void> => {
  await api.delete(`/blogs/${id}`);
};
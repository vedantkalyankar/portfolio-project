import api from "./axios";

export interface Project {
  id: string;
  title: string;
  description: string;
  github_url: string | null;
  live_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectsResponse {
  items: Project[];
  total: number;
  limit: number;
  offset: number;
}

export const getProjects = async (
  limit = 10,
  offset = 0,
): Promise<ProjectsResponse> => {
  const response = await api.get<ProjectsResponse>(
    "/projects",
    {
      params: {
        limit,
        offset,
      },
    },
  );

  return response.data;
};
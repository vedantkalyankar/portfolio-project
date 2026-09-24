import api from "./axios";

export interface Project {
  id: string;
  title: string;
  description: string;
  github_url: string;
  live_url: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreateRequest {
  title: string;
  description: string;
  github_url: string;
  live_url: string;
}

export interface ProjectUpdateRequest {
  title?: string;
  description?: string;
  github_url?: string;
  live_url?: string;
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

export const createProject = async (
  data: ProjectCreateRequest,
): Promise<Project> => {
  const response = await api.post<Project>(
    "/projects",
    data,
  );

  return response.data;
};

export const updateProject = async (
  id: string,
  data: ProjectUpdateRequest,
): Promise<Project> => {
  const response = await api.patch<Project>(
    `/projects/${id}`,
    data,
  );

  return response.data;
};

export const deleteProject = async (
  id: string,
): Promise<void> => {
  await api.delete(`/projects/${id}`);
};
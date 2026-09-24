import api from "./axios";

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: string;
  created_at: string;
  updated_at: string;
}

export interface SkillCreateRequest {
  name: string;
  category: string;
  proficiency: string;
}

export interface SkillUpdateRequest {
  name?: string;
  category?: string;
  proficiency?: string;
}

export interface SkillsResponse {
  items: Skill[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const getSkills = async (
  page = 1,
  pageSize = 10,
): Promise<SkillsResponse> => {
  const response = await api.get<SkillsResponse>("/skills", {
    params: {
      page,
      page_size: pageSize,
    },
  });

  return response.data;
};

export const createSkill = async (
  data: SkillCreateRequest,
): Promise<Skill> => {
  const response = await api.post<Skill>("/skills", data);

  return response.data;
};

export const updateSkill = async (
  id: string,
  data: SkillUpdateRequest,
): Promise<Skill> => {
  const response = await api.patch<Skill>(
    `/skills/${id}`,
    data,
  );

  return response.data;
};

export const deleteSkill = async (
  id: string,
): Promise<void> => {
  await api.delete(`/skills/${id}`);
};
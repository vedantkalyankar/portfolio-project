import api from "./axios";

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: string;
  created_at: string;
  updated_at: string;
}

export interface SkillsResponse {
  items: Skill[];
  total: number;
  limit: number;
  offset: number;
}

export const getSkills = async (): Promise<SkillsResponse> => {
  const response = await api.get<SkillsResponse>("/skills");

  return response.data;
};
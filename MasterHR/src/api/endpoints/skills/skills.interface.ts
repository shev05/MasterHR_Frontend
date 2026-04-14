import type { WithId } from '@/shared/interface';

export enum ESkillsLevel {
  BASE = 'Base',
  MIDDLE = 'Middle',
  ADVANCED = 'Advanced',
}

export const optionSkillsLevel = [
  { label: ESkillsLevel.BASE, value: ESkillsLevel.BASE, id: -1 },
  { label: ESkillsLevel.MIDDLE, value: ESkillsLevel.MIDDLE, id: -2 },
  { label: ESkillsLevel.ADVANCED, value: ESkillsLevel.ADVANCED, id: -3 },
];

export type BaseSkills = {
  name: string;
  level: string;
  years: number;
};

export type GetSkills = WithId<BaseSkills>;

export type GetSkillsResponse = {
  skills: GetSkills[];
  total_found: number;
};

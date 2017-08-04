type Question = {
  name: string,
};

type UnhydratedTemplateSkill = {
  id: string,
  name: string,
  version: number,
  criteria: string,
  type: string,
  questions: Question[],
};

type TemplateSkillViewModel = {
  id: string,
  name: string,
};

type SkillGroup = {
  category: string,
  level: string,
  skills: number[],
};

type TemplateViewModel = {
  id: string,
  name: string,
};

type NormalizedTemplateViewModel = {
  id: string,
  name: string,
  version: number,
  categories: string[],
  levels: string[],
  skillGroups: { [id: string]: SkillGroup },
};

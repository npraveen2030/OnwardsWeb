export interface SchedulerProfileSkill {
  id?: number | null;
  skillName: string;
  rating: number;
}

export interface SchedulerProfile {
  summaryId?: number | null;
  summary: string;
  skills: SchedulerProfileSkill[];
}

export interface SchedulerProfileSaveModel {
  loginId: number;
  summaryId?: number | null;
  summary: string;
  skills: SchedulerProfileSkill[];
}

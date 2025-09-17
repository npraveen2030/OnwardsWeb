import { BaseEntity } from './BaseEntity';

export interface jobdetails extends BaseEntity {
  id: number;
  roleId: number;
  projectId: number;
  locationId: number;
  projectDescription: string;
  skills: string[];
  nonDbSkills: string[];
  roleDescription: string;
  responsibilities: string;
  educationQualification: string;
  experienceRequired: string;
  domainSkills: string;
  requesitionBy: number;
  requesitionDate: string;
}

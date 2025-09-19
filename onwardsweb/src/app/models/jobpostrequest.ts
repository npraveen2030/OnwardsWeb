import { BaseEntity } from './BaseEntity';

export interface jobdetails extends BaseEntity {
  id?: number;
  roleId: number;
  projectId: number;
  locationId: number;
  companyId: number;
  skills: string[];
  nonDbSkills: string[];
  RolePurpose: string;
  responsibilities: string;
  educationDetails: string;
  experienceRequired: string;
  domainFunctionalSkills: string;
  requesitionBy: number;
  requesitionDate: string;
}

export interface skill {
  id: number;
  skillName: string;
}

export interface role {
  id: number;
  roleName: string;
}

export interface project {
  id: number;
  projectName: string;
}

export interface location {
  id: number;
  name: string;
}

export interface user {
  id: number;
  userName: string;
}

export interface company {
  id: number;
  companyName: string;
}

export interface AllJobDetails {
  id: number;
  roleName: string;
  locationName: string;
  createdDate: string;
}

export interface JobDetailsresponse {
  id?: number;
  projectId: number;
  projectName: string;
  roleId: number;
  roleName: string;
  rolePurpose: string; // HTML content as string
  locationId: number;
  locationName: string;
  companyId: number;
  companyDescription: string;
  skills: string; // comma-separated skills
  responsibilities: string; // HTML content as string
  educationDetails: string; // HTML content as string
  experienceRequired: string; // HTML content as string
  domainFunctionalSkills: string; // HTML content as string
  requesitionBy: number;
  requesitionUserName: string;
  requesitionDate: string; // ISO date string
  status: number;
  createdDate: string; // ISO date string
  createdBy: number;
  modifiedDate: string | null;
  modifiedBy: number | null;
  isActive: boolean;
}

// Request model
export interface ProjectManagementRequest {
  id?: number;
  loginId: number;
  projectName: string;
  startDate?: Date; // ISO date string e.g. '2025-10-04T00:00:00'
  endDate?: Date;
}

// Response model
export interface ProjectManagementResponse {
  id: number;
  projectName: string;
  startDate?: string;
  endDate?: string;
}

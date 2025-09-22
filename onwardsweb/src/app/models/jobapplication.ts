export interface JobApplicationRequest {
  id?: number | null; // Null for insert, value for update
  userId: number; // User applying for the job
  jobId: number; // Job ID
  loginId: number; // Logged-in user performing the action
  statusId: number; // Status of the application
}

export interface JobApplicationResponse {
  id: number; // Application ID
  jobId: number; // Job ID
  roleName: string; // Role name
  statusId: number;
  statusName: string;
  locationName: string; // Location
  createdDate: string; // Date when the application was created
}

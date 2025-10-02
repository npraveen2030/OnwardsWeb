export interface ReferralTrackingResponse {
  id: number;
  jobId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  locationName: string;
  fileName: string;
  status: string;
}

export interface ReferralTrackingRequest {
  jobId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  locationId: number;
  fileData: File;
  statusId: number;
  loginId: number;
}

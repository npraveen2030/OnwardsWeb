export interface savedjobrequest {
  userId: number;
  jobId: number;
  loginId: number;
}

export interface savedjobresponse {
  id: number;
  jobId: number;
  roleName: string;
  locationName: string;
}

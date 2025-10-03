// Request model (used for insert)
export interface UserProjectRoleAssociationRequest {
  loginId: number;
  userId: number;
  projectId: number;
  roleId: number;
  associationStartDate: string;
  associationEndDate?: string;
}

// Response model (used for get)
export interface UserProjectRoleAssociationResponse {
  id: number;
  userId: number;
  fullName: string;
  projectId: number;
  roleId: number;
  associationStartDate: string;
}

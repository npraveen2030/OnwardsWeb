export interface usermanagementresponse {
  id: number;
  employeeCode: string;
  fullName: string;
  email: string;
  password: string;
  mobile: string;
  doj: string; // ISO string date
  dor: string | null; // nullable
  roleId: number;
  roleName: string;
  gradeId: number;
  gradeValue: string;
  departmentId: number;
  departmentName: string;
  administrativeManagerId: number;
  administrativeManagerName: string;
  userTypeId: number;
  typeName: string;
  reportingManagerId: number;
  reportingManagerName: string;
  locationId: number;
  locationName: string;
  shiftId: number;
}

export interface UserRequest {
  id?: number | null;
  loginId: string;
  password: string;
  fullName: string;
  email: string;
  mobile: string;
  locationId: number;
  doj: string;
  dor?: string | null;
  roleId: number;
  gradeId: number;
  departmentId: number;
  userTypeId: number;
  shiftId: number;
  reportingManagerId?: number | null;
  administrativeManagerId?: number | null;
}

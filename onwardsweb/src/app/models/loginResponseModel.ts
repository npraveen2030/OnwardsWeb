export interface LoginResponse {
  id: number;
  username: string;
  loginTime: string;
  employeeCode: string;
  locationId: number;
  companyId: number;
  fullName: string;
  email: string;
  roleName: string;
  mobileNo: string;
  reportingManagerEmpCode: string;
  reportingManagerName: string;

  locationName: string;
  departmentName: string;
  gradeValue: string;
  doj: string | null;

  administrativeManagerEmpCode: string;
  administrativeManagerName: string;

  functionalReportingManagerEmpCode: string;
  functionalReportingManagerName: string;
}

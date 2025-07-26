export interface LoginResponse {
  message: string;
  body: boolean;
  status: number;
  userId: number;
  username: string;
  loginTime: string;
  employeeCode: string;
  fullName: string;
  email: string;
  roleName: string;
}
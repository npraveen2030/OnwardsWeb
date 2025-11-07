export interface LeaveReport {
  employeeCode: string;
  fullName: string;
  sickLeave: number;
  casualLeave: number;
  earnedLeave: number;
  maternityLeave: number;
  paternityLeave: number;
  bereavementLeave: number;
  unpaidLeave: number;
}

export interface AttendanceRegularizationReport {
  employeeCode: string;
  fullName: string;
  total: number;
  approved: number;
  rejected: number;
}

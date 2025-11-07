export interface LeaveTypes {
  id: number;
  leaveTypeName: string;
  remainingDays: number;
}

export interface calendarevent {
  date: string;
  statusId: number;
  loginTime: string;
  logOutTime: string;
}

export interface LeavesAndAttendance {
  isLeave: boolean;
  id: number;
  leaveTypeId?: number | null;
  leaveTypeName?: string | null;
  type?: number | null;
  startDate: string;
  endDate: string;
  duration: number;
  status?: string | null;
  reason?: string | null;
  createdDate?: string | null;
}

// ===============================
// Attendance Regularization DTO
// ===============================
export interface AttendanceRegularization {
  id: number;
  userId: number;
  fullName: string;
  startDate: string;
  endDate: string;
  duration: number;
  reason?: string; // optional, because it can be NULL in SQL
  action?: string; // optional, because it can be NULL in SQL
  statusName: string;
}

// ===============================
// User Leave Applied DTO
// ===============================
export interface UserLeaveApplied {
  id: number;
  userId: number;
  fullName: string;
  phoneNo?: string; // may be NULL
  leaveTypeName: string;
  noOfDays: number;
  startDate: string;
  endDate: string;
  reason?: string; // may be NULL
  action?: string; // may be NULL
  notifiedUserName?: string; // may be NULL
  statusName: string;
  fileName?: string; // may be NULL (file attachment)
}

export interface AttendanceRegularizationDetails {
  userName: string;
  managerName: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  action?: string;
  statusName: string;
}

export interface UserLeaveAppliedDetails {
  id: number;
  userName: string;
  managerName: string;
  leaveTypeName: string;
  noOfDays: number;
  startDate: string;
  endDate: string;
  reason: string;
  action?: string;
  statusName: string;
  fileName: string;
}

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

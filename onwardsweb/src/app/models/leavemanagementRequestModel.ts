export interface LeaveRequest {
  userId: number;
  loginId: number;
  leaveTypeId: number;
  year: number;
  startDate: string;
  endDate: string;
  isFullDay: boolean;
  phoneNo: string;
  locationId?: number;
  reason?: string;
  leaveStatusId: number;
  notifiedUserId: number;
}

export interface AttendanceRegularizationrequest {
  userId: number;
  typeId: number;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  loginId: number;
}

export interface LeaveUpdateRequest {
  id: number;
  userId: number;
  loginId: number;
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  noOfDays: number;
  action?: string;
  leaveStatusId: number;
}

export interface AttendanceRegularizationUpdateRequest {
  id: number;
  userId: number;
  startDate: string;
  endDate: string;
  action?: string;
  loginId: number;
  statusId: number;
}

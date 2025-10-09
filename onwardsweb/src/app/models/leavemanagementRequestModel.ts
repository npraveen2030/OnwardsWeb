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

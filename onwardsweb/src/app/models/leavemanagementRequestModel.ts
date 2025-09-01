export interface LeaveRequest {
  userId: number;
  loginId: number;

  id?: number;
  leaveTypeId: number;
  year: number;
  startDate: string;
  endDate: string;
  noOfDays?: number;
  locationId?: number;
  reason?: string;
  action?: string;
  fileName?: string;
  leaveStatusId: number;
}

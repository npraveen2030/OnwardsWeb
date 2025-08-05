export interface UserShiftLogResponse {
  logId: number;
  shiftId: number;
  date: string; // ISO date string, e.g., "0001-01-01"
  shift: string | null;
  todayDate: string; // format: "dd-MM-yyyy HH:mm:ss"
  shiftStartTime: string; // format: "hh:mm AM/PM"
  loginTime: string; // format: "hh:mm AM/PM"
  logOutTime: string;
  totalLoggedInHours: string; // could be a number if always numeric
  userId: number;
  loginId: number;
  createdBy: string | null;
  createdDate: string | null;
  modifiedBy: string | null;
  modifiedDate: string | null;
  isActive: boolean;
}

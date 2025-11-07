export interface AdminSchedule {
  id: number;
  companyId: number;
  companyName: string;
  noOfDays: number;
  userScheduleHoliday: boolean;
  userScheduleWeekOff: boolean;
}

export interface AdminScheduleModel {
  id?: number;
  companyId: number;
  noOfDays: number;
  userScheduleHoliday: boolean;
  userScheduleWeekOff: boolean;
  loginId: number;
}

export interface Company {
  id: number;
  companyName: string;
}

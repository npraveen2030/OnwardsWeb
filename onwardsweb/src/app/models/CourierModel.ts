export interface CourierUser {
  id: number;
  employeeCode: string;
  fullName: string;
  mobile: string;
}

export interface Courier {
  id?: number;
  userId: number;
  comments?: string;
  statusId: number;
  loginId: number;
}

export interface CourierList {
  id: number;
  userId: number;
  fullName: string;
  comments?: string;
  statusId: number;
  status: string;
}

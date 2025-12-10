export interface UserAddress {
  UserId: number;
  LoginId: number;
  CreatedBy: number;
  CreatedDate: string;
  ModifiedBy: number;
  ModifiedDate: string;
  IsActive: boolean;
  DoorNo: string;
  AddressLine: string;
  State: string;
  Pincode: string;
  IsPresentAddress: boolean;
  SameAsPresent: boolean;
}

export interface PersonalDetailsModel {
  UserId: number;
  LoginId: number;
  CreatedBy: number;
  CreatedDate: string;
  ModifiedBy: number;
  ModifiedDate: string;
  IsActive: boolean;

  FirstName: string;
  MiddleName: string;
  LastName: string;
  PersonalEmailID: string;

  PrimaryContactNumber_BasicDetails: number;
  Gender: number;
  FatherOrHusbandName: string;
  DOB: string;

  Nationality: number;
  DifferentlyAbled: number;
  VaccinationStatus: number;
  BloodGroup: number;
  BloodDonor: number;

  PanNumber: string;
  AadhaarCardno: number;

  UserAddresses: UserAddress[];

  PFNo: string;
  UANNo: string;
  ESICNo: string;

  BankAccountNumber: string;
  AccountHolderName: string;
  IFSCCode: string;
  BankName: string;
  BranchName: string;

  ContactName: string;
  ContactRelationship: string;
  PrimaryContactNumber_EmergencyContactDetails: string;
  SecondaryContactNumber?: string;
}

export interface IdValueDto {
  id: number;
  value: string;
}

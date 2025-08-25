import { BaseEntity } from './BaseEntity';

export interface Resignation extends BaseEntity {
  id: number;
  userId: number;
  resignationTypeId: number;
  resignationReasonId: number;
  resignationLetterDate: string; // Date from API usually comes as ISO string
  requestedRelievingDate: string;
  actualRelievingDate: string;
  noticePeriod: number;
  endOfNoticePeriod: number;
  mailingAddress?: string;
  address?: string;
  personalEmailId?: string;
  comments?: string;
  attachmentFile?: string;
  pullbackComment?: string;
  statusId?: number;
  approvedBy?: number;
  approvalDate?: string;
  approverRemarks?: string;
}

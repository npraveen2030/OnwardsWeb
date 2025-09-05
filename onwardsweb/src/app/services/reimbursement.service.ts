import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReimbursementService {

  constructor() { }

   private reimbursements: any[] = [];

  addReimbursement(data: any) {
    this.reimbursements.push(data);
  }

  getReimbursements() {
    return this.reimbursements;
  }
}

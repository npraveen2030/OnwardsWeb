import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  UserProjectRoleAssociationRequest,
  UserProjectRoleAssociationResponse,
} from '../models/userprojectroleassociationmodel';

@Injectable({
  providedIn: 'root',
})
export class UserProjectRoleAssociationService {
  private apiService = 'https://localhost:7255/api'; // Base URL

  constructor(private http: HttpClient) {}

  // Insert association
  insertAssociation(
    association: UserProjectRoleAssociationRequest
  ): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiService}/UserProjectRoleAssociation/insert`,
      association,
      { withCredentials: true }
    );
  }

  // Get associations for a project
  getAssociations(projectId: number): Observable<UserProjectRoleAssociationResponse[]> {
    return this.http.get<UserProjectRoleAssociationResponse[]>(
      `${this.apiService}/UserProjectRoleAssociation/get/${projectId}`,
      { withCredentials: true }
    );
  }

  // Delete association
  deleteAssociation(id: number, loginId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiService}/UserProjectRoleAssociation/delete/${id}/${loginId}`,
      { withCredentials: true }
    );
  }
}

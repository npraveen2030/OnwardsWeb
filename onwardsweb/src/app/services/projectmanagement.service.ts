import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ProjectManagementRequest,
  ProjectManagementResponse,
} from '../models/projectmanagementmodel';

@Injectable({
  providedIn: 'root',
})
export class ProjectManagementService {
  private apiService = 'https://localhost:7255/api'; // Base URL

  constructor(private http: HttpClient) {}

  // Insert or Update Project
  insertOrUpdateProject(
    project: ProjectManagementRequest
  ): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiService}/ProjectManagement/insertOrUpdate`,
      project,
      { withCredentials: true }
    );
  }

  // Get all projects
  getProjects(): Observable<ProjectManagementResponse[]> {
    return this.http.get<ProjectManagementResponse[]>(`${this.apiService}/ProjectManagement/get`, {
      withCredentials: true,
    });
  }

  // Delete project (soft delete)
  deleteProject(id: number, loginId: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiService}/ProjectManagement/delete/${id}/${loginId}`,
      { withCredentials: true }
    );
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SavedSearchRequest, SavedSearchResponse } from '../models/savedsearchmodel';

@Injectable({
  providedIn: 'root',
})
export class SavedSearchService {
  private apiService = 'https://localhost:7255/api'; // Base URL

  constructor(private http: HttpClient) {}

  /**
   * Get all active saved searches
   */
  getAllSavedSearch(userId: number): Observable<SavedSearchResponse[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .get<SavedSearchResponse[]>(`${this.apiService}/SavedSearch/getall`, {
        headers,
        params: { UserId: userId.toString() },
        withCredentials: true,
      })
      .pipe(
        map((searchArray) => {
          return searchArray.map((search) => {
            return {
              ...search,
              keyword: JSON.parse(search.search).keyword,
              reqId: JSON.parse(search.search).reqId,
              location: JSON.parse(search.search)
                .location.map((loc: { id: number; name: string }) => loc.name)
                .join(', '),
            };
          });
        })
      );
  }

  /**
   * Insert or update a saved search
   * Returns true if the search name is unique
   */
  insertOrUpdateSavedSearch(details: SavedSearchRequest): Observable<{ isUnique: boolean }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<{ isUnique: boolean }>(
      `${this.apiService}/SavedSearch/insertorupdate`,
      details,
      {
        headers,
        withCredentials: true,
      }
    );
  }

  /**
   * Delete a saved search by Id
   */
  deleteSavedSearch(id: number): Observable<{ message: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.delete<{ message: string }>(`${this.apiService}/SavedSearch/delete/${id}`, {
      headers,
      withCredentials: true,
    });
  }
}

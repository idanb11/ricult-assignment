import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Location } from '../location';

@Injectable({
  providedIn: 'root',
})
export class LocationDataService {
  private readonly apiBaseURL = environment.apiBaseURL;

  constructor(private http: HttpClient) {}

  public getLocationData(query: string): Observable<Location[]> {
    if (!query) {
      return of([]);
    }
    const path = 'locations';
    const options = { params: new HttpParams().set('q', query) };
    return this.http.get<Location[]>(`${this.apiBaseURL}${path}`, options);
  }
}

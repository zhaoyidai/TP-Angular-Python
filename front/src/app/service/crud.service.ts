import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Intervention } from '../model/intervention';
@Injectable({
  providedIn: 'root'
})
export class CrudService {
  serviceURL : string;
  constructor(private http : HttpClient) {
    
    this.serviceURL = 'http://127.0.0.1:5000/interventions';
   }

   getAllIntervention(): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(this.serviceURL).pipe(
      catchError(this.handleError)
    );
  }
  deleteIntervention(intervention : Intervention):Observable<any>{
    return this.http.delete<Intervention>(`${this.serviceURL}/${intervention.id}`).pipe(
      catchError(this.handleError)
    );
  }

  addIntervention(intervention : Intervention):Observable<any> {
    return this.http.post<any>(this.serviceURL, intervention).pipe(
      catchError(this.handleError)
    );
  }
  editIntervention(intervention : Intervention):Observable<any>{
    return this.http.put<Intervention>(`${this.serviceURL}/${intervention.id}`,intervention).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Error code ${error.status}: ${error.error.message}`;
      }
    
    return throwError(errorMessage);
  }
}

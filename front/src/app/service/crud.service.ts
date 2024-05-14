import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Intervention } from '../model/intervention';
@Injectable({
  providedIn: 'root'
})
export class CrudService {
  serviceURL : string;
  constructor(private http : HttpClient) {
    
    this.serviceURL = 'http://127.0.0.1:5000/interventions';
   }

   getAllIntervention():Observable<Intervention[]>{
    return this.http.get<Intervention[]>(this.serviceURL);
  }
  deleteIntervention(intervention : Intervention):Observable<any>{
    return this.http.delete<Intervention>(`${this.serviceURL}/${intervention.id}`);
  }

}

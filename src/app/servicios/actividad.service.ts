import { Injectable } from '@angular/core';
import { Actividad } from '../modelo/Actividad';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  actividades: Actividad[] = [];
  private apiUrlActividad = 'http://localhost:3000/actividad';

  constructor(private http: HttpClient) { }


  createActividad(actividad: Actividad): Observable<any>  {
    return this.http.post(this.apiUrlActividad, actividad);
  }

  obtenerActividades(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlActividad);
  }

  eliminarActividad(id: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/actividad/${id}`);
  }
}

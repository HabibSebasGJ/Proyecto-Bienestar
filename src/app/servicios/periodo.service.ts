import { Injectable } from '@angular/core';
import { Periodo } from '../modelo/Periodo';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {

  semestrePeriodo : Periodo[] = [];
  private UrlApi = 'http://localhost:3000/periodo';

  constructor(private httpClient: HttpClient) { }

  obtenerSemestre(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.UrlApi);
  }

  crearSemestre(actividad: Periodo): Observable<any>  {
    return this.httpClient.post(this.UrlApi, actividad);
  }

  cambiarEstadoSemestre(id: number, estado: boolean): Observable<any> {
    return this.httpClient.patch(`${this.UrlApi}/${id}`, { actual: estado });
  }

}

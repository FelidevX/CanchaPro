import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {

  private apiUrl = 'http://localhost:3000/equipos';

  constructor(private http: HttpClient) { }

  crearEquipo(equipo: any): Observable<any>{
    return this.http.post(this.apiUrl, equipo);
    }

  obtenerEquipos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
    }
}

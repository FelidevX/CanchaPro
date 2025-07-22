import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CanchaService {
  private apiUrl = environment.apiUrl + '/canchas';

  constructor(private http: HttpClient) { }

  crearCancha(cancha: any): Observable<any> {
    return this.http.post(this.apiUrl, cancha);
  }

  obtenerCanchas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerCanchasPorDueno(id_dueno: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dueno/${id_dueno}`);
  }

  actualizarCancha(cancha: any) {
  return this.http.put(`${this.apiUrl}/${cancha.id}`, cancha);
  }

  eliminarCancha(id: number) {
  return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

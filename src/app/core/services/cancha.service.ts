import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CanchaService {
  private apiUrl = 'http://localhost:3000/canchas';

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
}

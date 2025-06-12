import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://localhost:3000/reservas';

  constructor(private http: HttpClient) { }

  crearReserva(reserva: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, reserva);
  }

  obtenerReservasPorDueno(idDueno: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${idDueno}`);
  }

  actualizarReserva(reserva: any) {
    return this.http.put<any>(`${this.apiUrl}/${reserva.id}`, reserva);
  }
}

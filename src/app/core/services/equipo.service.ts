import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {

  private apiUrl = 'https://backend-canchapro.onrender.com/equipos';

  constructor(private http: HttpClient) { }

  crearEquipo(equipo: any): Observable<any>{
    return this.http.post(this.apiUrl, equipo);
    }

  obtenerEquipos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
    }

  obtenerEquipoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  actualizarEquipo(equipo: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${equipo.id}`, equipo);
  }

  solicitudUnirseEquipo(solicitud: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/solicitud`, solicitud);
  }

  listarSolicitudes(idEquipo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/solicitudes/${idEquipo}`);
  }

  aceptarSolicitud(solicitudId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/solicitud/aceptar/${solicitudId}`, {});
  }

  agregarJugadorEquipo(solicitud: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/jugador`, solicitud);
  }

  obtenerJugadoresEquipo(idEquipo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/jugador/${idEquipo}`);
  }

  rechazarSolicitud(solicitudId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/solicitud/rechazar/${solicitudId}`, {});
  }

  retarEquipo(id_equipo: number, id_equipo_receptor: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/retar`, { id_equipo, id_equipo_receptor});
  }

  obtenerEquipoCapitan(idUsuario: number): Observable<any> { 
    return this.http.get<any>(`${this.apiUrl}/capitan/${idUsuario}`);
  }

  eliminarJugadorEquipo(idEquipo: number, idJugador: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/jugador/${idEquipo}/${idJugador}`);
  }

}

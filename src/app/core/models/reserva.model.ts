export interface Reserva {
  id?: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado?: string;
  id_usuario: number;
  id_cancha: number;
}
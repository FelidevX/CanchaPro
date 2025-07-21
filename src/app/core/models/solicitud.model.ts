export interface Solicitud {
    id?: number;
    estado: 'pendiente' | 'aceptada' | 'rechazada';
    fecha_solicitud: string;
    id_usuario: number;
    id_equipo: number;
    nombre?: string; 
    posicion?: string;
    rol?: 'jugador' | 'capitan';
}
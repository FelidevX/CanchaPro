export interface Jugador {
    id?: number;
    nombre: string;
    posicion: 'portero' | 'defensa' | 'mediocampista' | 'delantero';
    rol: 'jugador' | 'capitan';
    id_equipo?: number;
}
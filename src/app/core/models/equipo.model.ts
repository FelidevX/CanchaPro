export interface Equipo {
    id?: number;
    nombre: string;
    descripcion: string;
    ubicacion: string;
    nivel: 'principiante' | 'intermedio' | 'avanzado' | 'profesional';
    id_dueno: number;
    nombre_dueno?: string;
}
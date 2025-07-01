import { Component } from '@angular/core';
import { EquipoService } from '../../../core/services/equipo.service';
import { Equipo } from '../../../core/models/equipo.model';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrl: './equipos.component.css'
})
export class EquiposComponent {

  equipos: Equipo[] = [];
  usuarioLogueado: boolean = false;

  equipo: Equipo = {
    nombre: '',
    descripcion: '',
    ubicacion: '',
    nivel: 'principiante',
    id_dueno: Number(localStorage.getItem('user_id'))
  }


  constructor(private equipoService: EquipoService) {}

  abrirModalCrear() {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('modalCrearEquipo'));
    modal.show();
  }

  crearEquipo(equipo: any): void {
    if (!this.usuarioLogueado) {
      alert('Debes iniciar sesión para crear un equipo.');
      return;
    }

    this.equipoService.crearEquipo(this.equipo).subscribe({
      next: (response) => {
        this.equipos.push(response);
        
        this.equipo = {
          nombre: '',
          descripcion: '',
          ubicacion: '',
          nivel: 'principiante',
          id_dueno: Number(localStorage.getItem('user_id'))
        }
        
        alert('Equipo creado exitosamente!');
      },
      error: (err) => {
        console.error('Error backend:', err);
        alert('Error al crear el equipo. Inténtalo de nuevo.');
      }
    })
  }

  canchaCrearConfirmada(){
    this.crearEquipo(this.equipo);
  }

  ngOnInit(): void {
    this.usuarioLogueado = !!localStorage.getItem('access_token');
    this.equipoService.obtenerEquipos().subscribe({
      next: (response) => {
        this.equipos = response
      },
      error: (err) => console.error('Error al cargar los equipos: ', err)
    })

  }


  /* equipos = [
    {
      nombre: 'Los Tigres FC',
      ubicacion: 'Santiago Centro',
      descripcion: 'Equipo amateur competitivo que busca jugadores comprometidos para torneos locales.',
      miembros: 8,
      capacidad: 11,
      lider: 'Carlos Mendoza',
      tipo: 'Fútbol 11',
      nivel: 'Intermedio',
      buscan: ['Defensor', 'Mediocampista'],
      fechaProximoPartido: new Date(2025, 5, 14),
      lleno: false
    },
    {
      nombre: 'Águilas Doradas',
      ubicacion: 'Providencia',
      descripcion: 'Equipo recreativo que juega los fines de semana. Ambiente familiar y divertido.',
      miembros: 7,
      capacidad: 10,
      lider: 'Ana Martínez',
      tipo: 'Fútbol 7',
      nivel: 'Principiante',
      buscan: ['Delantero', 'Portero'],
      fechaProximoPartido: new Date(2025, 5, 11),
      lleno: false
    },
    {
      nombre: 'Rayos Azules',
      ubicacion: 'Las Condes',
      descripcion: 'Equipo competitivo con experiencia en torneos regionales. Buscamos jugadores serios.',
      miembros: 11,
      capacidad: 11,
      lider: 'Roberto Silva',
      tipo: 'Fútbol 11',
      nivel: 'Avanzado',
      buscan: [],
      fechaProximoPartido: new Date(2025, 5, 17),
      lleno: true
    }
  ]; */
}

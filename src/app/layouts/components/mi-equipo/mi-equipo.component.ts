import { Component, OnInit, ViewChild} from '@angular/core';
import { Equipo } from '../../../core/models/equipo.model';
import { EquipoService } from '../../../core/services/equipo.service';
import { Solicitud } from '../../../core/models/solicitud.model';
import { Jugador } from '../../../core/models/jugador.model';
import { AlertsComponent } from '../alerts/alerts.component';

@Component({
  selector: 'app-mi-equipo',
  templateUrl: './mi-equipo.component.html',
  styleUrl: './mi-equipo.component.css'
})
export class MiEquipoComponent implements OnInit {
  @ViewChild(AlertsComponent) alerta!: AlertsComponent;

  mostrarMiEquipo = true;
  mostrarJugadores = false;
  equipo: Equipo = {
    id: 0,
    nombre: '',
    descripcion: '',
    ubicacion: '',
    nivel: 'principiante',
    id_dueno: Number(localStorage.getItem('user_id')),
  };

  solicitudes: Solicitud[] = [];
  jugadores: Jugador[] = [];
  jugadorAEliminar: Jugador | null = null;
  mostrarModalEliminar: boolean = false;


  constructor(private equipoService: EquipoService ) { }

  ngOnInit() {
    this.cargarEquipo();
  }

  cargarEquipo() {
    const userId = Number(localStorage.getItem('user_id'));
    if (userId) {
      this.equipoService.obtenerEquipoPorId(userId).subscribe({
        next: (equipo: Equipo) => {
          if (equipo) {
            this.equipo = equipo;
          } else {
            console.log('No se encontró equipo para este usuario');
          }
        },
        error: (err) => {
          console.error('Error al obtener el equipo:', err);
        }
      });
    }
  }

  listarSolicitudes(idEquipo: number) {
    this.equipoService.listarSolicitudes(idEquipo).subscribe({
      next: (solicitudes: Solicitud[]) => {
        if (solicitudes.length > 0) {
          this.solicitudes = solicitudes;
          console.log('Solicitudes para el equipo:', solicitudes);
        } else {
          console.log('No hay solicitudes pendientes para este equipo');
        }
      },
      error: (err) => {
        console.error('Error al listar solicitudes:', err);
      }
    });
  }

  actualizarEquipo() {
    this.equipoService.actualizarEquipo(this.equipo).subscribe({
      next: (data: Equipo) => {
        this.equipo = data;
        this.alerta.showAlert('Equipo actualizado exitosamente!', 'success');
        this.cargarEquipo();
      }, error: (err) => {
        console.error('Error al actualizar el equipo:', err);
        this.alerta.showAlert('No se pudieron actualizar los datos del equipo. Por favor, inténtalo de nuevo más tarde.', 'danger');
      }
    })
  }

  aceptarSolicitud(solicitud: Solicitud) {
    const yaEsMiembro = this.jugadores.some(j => j.id === solicitud.id_usuario);
    if (yaEsMiembro) {
      this.alerta.showAlert('Este jugador ya pertenece al equipo.', 'warning');
      return;
    }
    this.equipoService.aceptarSolicitud(solicitud.id!).subscribe({
      next: (response) => {
        this.alerta.showAlert('Solicitud aceptada exitosamente!', 'success');
        this.solicitudes[0].estado = 'aceptada';
        this.agregarJugadorEquipo(solicitud);
        this.listarSolicitudes(this.equipo.id!);
      },
      error: (err) => {
        console.error('Error al aceptar la solicitud:', err);
        this.alerta.showAlert('No se pudo aceptar la solicitud. Por favor, inténtalo de nuevo más tarde.', 'danger');
      }
    });
  }

  rechazarSolicitud(solicitud: Solicitud) {
    this.equipoService.rechazarSolicitud(solicitud.id!).subscribe({
      next: (response) => {
        this.alerta.showAlert('Solicitud rechazada exitosamente!', 'success');
        solicitud.estado = 'rechazada';
      },
      error: (err) => {
        console.error('Error al rechazar la solicitud:', err);
        this.alerta.showAlert('No se pudo rechazar la solicitud. Por favor, inténtalo de nuevo más tarde.', 'danger');
      }
    });
  }

  agregarJugadorEquipo(solicitud: Solicitud) {
    const body = {
      id_usuario: solicitud.id_usuario,
      id_equipo: solicitud.id_equipo,
      rol: 'jugador'

    }
    this.equipoService.agregarJugadorEquipo(body).subscribe({
      next: (response) => {
        this.alerta.showAlert('Jugador agregado al equipo exitosamente!', 'success');
        this.obtenerJugadoresEquipo();
      },
      error: (err) => {
        console.error('Error al agregar jugador al equipo:', err);
        this.alerta.showAlert('No se pudo agregar el jugador al equipo. Por favor, inténtalo de nuevo más tarde.', 'danger');
      }
    });
  }

  obtenerJugadoresEquipo() {
    this.equipoService.obtenerJugadoresEquipo(this.equipo.id!).subscribe({
      next: (response) => {
        this.jugadores = response;
      },
      error: (err) => {
        console.error('Error al obtener los jugadores del equipo:', err);
      }
    });
  }

  eliminarJugador(jugador: Jugador) {
    if (jugador.rol === 'capitan') {
      this.alerta.showAlert('No puedes eliminar al capitán del equipo.', 'warning');
      return;
    }
    this.jugadorAEliminar = jugador;
    this.mostrarModalEliminar = true;
  }

  confirmarEliminarJugador() {
    if (!this.jugadorAEliminar) return;
    this.equipoService.eliminarJugadorEquipo(this.equipo.id!, this.jugadorAEliminar.id!).subscribe({
      next: (response) => {
        this.alerta.showAlert('Jugador eliminado del equipo exitosamente!', 'success');
        this.obtenerJugadoresEquipo();
        this.cerrarModalEliminar();
      },
      error: (err) => {
        console.error('Error al eliminar el jugador del equipo:', err);
        this.alerta.showAlert('No se pudo eliminar al jugador del equipo. Por favor, inténtalo de nuevo más tarde.', 'danger');
        this.cerrarModalEliminar();
      }
    });
  }

  cerrarModalEliminar() {
    this.mostrarModalEliminar = false;
    this.jugadorAEliminar = null;
  }

  toggleMiEquipo() {
    this.mostrarMiEquipo = true;
    this.mostrarJugadores = false;
  }

  toggleJugadores() {
    this.mostrarMiEquipo = false;
    this.mostrarJugadores = true;
    this.obtenerJugadoresEquipo();
    this.listarSolicitudes(this.equipo.id!);
  }
}

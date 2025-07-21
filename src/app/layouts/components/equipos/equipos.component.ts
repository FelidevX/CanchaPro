import { Component, ViewChild } from '@angular/core';
import { EquipoService } from '../../../core/services/equipo.service';
import { Equipo } from '../../../core/models/equipo.model';
import { Solicitud } from '../../../core/models/solicitud.model';
import { AlertsComponent } from '../alerts/alerts.component';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrl: './equipos.component.css'
})
export class EquiposComponent {
  @ViewChild(AlertsComponent) alerta!: AlertsComponent;

  equipos: Equipo[] = [];
  usuarioLogueado: boolean = false;
  equiposConUsuario: number[] = []; // IDs de equipos donde el usuario ya es miembro

  equipo: Equipo = {
    nombre: '',
    descripcion: '',
    ubicacion: '',
    nivel: 'principiante',
    id_dueno: Number(localStorage.getItem('user_id'))
  }

  solicitud: Solicitud = {
      estado: 'pendiente',
      fecha_solicitud: new Date().toISOString(),
      id_usuario: Number(localStorage.getItem('user_id')),
      id_equipo: 0
    };

  constructor(private equipoService: EquipoService) {}

  get yaTieneEquipo(): boolean {
    const idUsuario = Number(localStorage.getItem('user_id'));
    return this.equipos.some(e => e.id_dueno === idUsuario);
  }

  abrirModalCrear() {

    if (!this.usuarioLogueado) {
      this.alerta.showAlert('Debes iniciar sesión para crear un equipo.', 'warning');
      return;
    }

    if (this.yaTieneEquipo) {
      this.alerta.showAlert('Ya tienes un equipo creado. No puedes crear más de uno.', 'danger');
      return;
    }
    const modal = new (window as any).bootstrap.Modal(document.getElementById('modalCrearEquipo'));
    modal.show();
  }

  crearEquipo(equipo: any): void {

    const idUsuario = Number(localStorage.getItem('user_id'));
    const yaTieneEquipo = this.equipos.some(e => e.id_dueno === idUsuario);
    if (yaTieneEquipo) {
      this.alerta.showAlert('Ya tienes un equipo creado. No puedes crear más de uno.', 'warning');
      return;
    }

    this.equipoService.crearEquipo(this.equipo).subscribe({
      next: (response) => {
        this.equipos.push(response);

        const body = {
          id_usuario: idUsuario,
          id_equipo: response.id,
          rol: 'capitan'
        };
        this.equipoService.agregarJugadorEquipo(body).subscribe({
          next: () => {
            this.alerta.showAlert('Equipo creado exitosamente.', 'success');
            this.marcarEquiposConUsuario();
          },
          error: (err) => {
            this.alerta.showAlert('Equipo creado, pero no se pudo unirte automáticamente como capitán.', 'warning');
            console.error('Error al agregarse como capitán:', err);
          }
        });

        this.equipo = {
          nombre: '',
          descripcion: '',
          ubicacion: '',
          nivel: 'principiante',
          id_dueno: idUsuario
        }
      },
      error: (err) => {
        console.error('Error backend:', err);
        this.alerta.showAlert('Error al crear el equipo. Inténtalo de nuevo.', 'danger');
      }
    });
  }

  canchaCrearConfirmada(){
    this.crearEquipo(this.equipo);
  }

  solicitarUnirseEquipo(id_equipo: number) {

    if (!this.usuarioLogueado) {
      this.alerta.showAlert('Debes iniciar sesión para crear un equipo.', 'warning');
      return;
    }

    const idUsuario = Number(localStorage.getItem('user_id'));
    // Busca si ya existe una solicitud pendiente para este usuario y equipo
    this.equipoService.listarSolicitudes(id_equipo).subscribe({
      next: (solicitudes) => {
        const yaSolicito = solicitudes.some((s: any) => s.id_usuario === idUsuario && s.estado === 'pendiente');
        if (yaSolicito) {
          this.alerta.showAlert('Ya has enviado una solicitud pendiente a este equipo.', 'warning');
          return;
        }
        // Verifica si ya es miembro
        this.equipoService.obtenerJugadoresEquipo(id_equipo).subscribe({
          next: (jugadores) => {
            if (jugadores.some((j: any) => j.id === idUsuario)) {
              this.alerta.showAlert('Ya eres miembro de este equipo.', 'warning');
              return;
            }
            const solicitud: Solicitud = {
              estado: 'pendiente',
              fecha_solicitud: new Date().toISOString(),
              id_usuario: idUsuario,
              id_equipo: id_equipo
            };
            this.equipoService.solicitudUnirseEquipo(solicitud).subscribe({
              next: (response) => {
                this.alerta.showAlert('Solicitud enviada exitosamente!', 'success');
              },
              error: (err) => {
                console.error('Error al enviar la solicitud:', err);
                this.alerta.showAlert('No se pudo enviar la solicitud. Por favor, inténtalo de nuevo más tarde.', 'danger');
              }
            });
          },
          error: (err) => {
            console.error('Error al verificar miembros del equipo:', err);
            this.alerta.showAlert('No se pudo verificar si ya eres miembro del equipo. Intenta de nuevo.', 'danger');
          }
        });
      },
      error: (err) => {
        console.error('Error al verificar solicitudes:', err);
        this.alerta.showAlert('No se pudo verificar si ya tienes una solicitud pendiente. Intenta de nuevo.', 'danger');
      }
    });
  }

  retarPartido(idEquipoRetado: number) {
    if (!this.usuarioLogueado) {
      this.alerta.showAlert('Debes iniciar sesión para retar a un partido.', 'warning');
      return;
    }

    if (this.equipos.length < 2) {
      this.alerta.showAlert('No hay suficientes equipos para retar a un partido.', 'warning');
      return;
    }

    const idUsuario = Number(localStorage.getItem('user_id'));
    this.equipoService.obtenerEquipoCapitan(idUsuario).subscribe({
      next: (equipoRetador) => {
        if (!equipoRetador || !equipoRetador.id) {
          this.alerta.showAlert('No eres capitán de ningún equipo.', 'warning');
          return;
        }
        if (idEquipoRetado === equipoRetador.id) {
          this.alerta.showAlert('No puedes retar a tu propio equipo.', 'warning');
          return;
        }
        this.equipoService.retarEquipo(equipoRetador.id, idEquipoRetado).subscribe({
          next: (response) => {
            this.alerta.showAlert('Reto enviado exitosamente.', 'success');
          },
          error: (err) => {
            console.error('Error al enviar el reto:', err);
            this.alerta.showAlert('No se pudo enviar el reto. Por favor, inténtalo de nuevo más tarde.', 'danger');
          }
        });
      },
      error: (err) => {
        this.alerta.showAlert('Error al verificar tu equipo.', 'danger');
      }
    });
  }

  ngOnInit(): void {
    this.usuarioLogueado = !!localStorage.getItem('access_token');
    this.equipoService.obtenerEquipos().subscribe({
      next: (response) => {
        this.equipos = response;
        this.marcarEquiposConUsuario();
      },
      error: (err) => console.error('Error al cargar los equipos: ', err)
    });
  }

  marcarEquiposConUsuario() {
    const idUsuario = Number(localStorage.getItem('user_id'));
    this.equiposConUsuario = [];
    this.equipos.forEach(equipo => {
      this.equipoService.obtenerJugadoresEquipo(equipo.id!).subscribe({
        next: (jugadores) => {
          if (jugadores.some((j: any) => j.id === idUsuario)) {
            this.equiposConUsuario.push(equipo.id!);
          }
        }
      });
    });
  }
}

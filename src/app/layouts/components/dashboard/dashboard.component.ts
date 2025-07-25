import { Component, ViewChild } from '@angular/core';
import { CanchaService } from '../../../core/services/cancha.service';
import { AlertsComponent } from '../alerts/alerts.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  @ViewChild(AlertsComponent) alerta!: AlertsComponent;

  cancha = {
    nombre: '',
    direccion: '',
    precio: null,
    descripcion: '',
    rating: 0.0,
    id_dueno: Number(localStorage.getItem('user_id'))
  }

  canchasUsuario: any[] = [];
  usuarioId: number = Number(localStorage.getItem('user_id'));
  canchaEditando: any = null;
  canchaAEliminar: any = null;

   constructor(private canchaService: CanchaService) {}

  mostrarFormularioCrear = true;
  mostrarCanchas = false;
  mostrarFormularioEditar = false;
  mostrarReservasE = false;
  
  guardarCancha() {
  
    this.cancha.id_dueno = Number(localStorage.getItem('user_id'));

    this.canchaService.crearCancha(this.cancha).subscribe({
      next: (response) => {
        this.alerta.showAlert('Cancha creada exitosamente', 'success');
        this.cancha = {
          nombre: '',
          direccion: '',
          precio: null,
          descripcion: '',
          rating: 0.0,
          id_dueno: Number(localStorage.getItem('user_id'))
        }
      },
      error: (err) => {
        this.alerta.showAlert('Error al guardar la cancha', 'danger');
        console.error('Error backend:', err);
      }
    })
  }

  editarCancha(cancha: any) {
  this.canchaEditando = { ...cancha };
  this.mostrarFormularioEditar = true;
  this.mostrarFormularioCrear = false;
  this.mostrarCanchas = false;
  this.mostrarReservasE = false;
  }

  guardarEdicionCancha() {
    this.canchaService.actualizarCancha(this.canchaEditando).subscribe({
    next: () => {
      this.mostrarVerCanchas();
      this.mostrarFormularioEditar = false;
      this.canchaEditando = null;
    },
    error: (err) => console.error('Error al actualizar cancha', err)
    });
  }

  cancelarEdicion() {
    this.mostrarFormularioEditar = false;
    this.canchaEditando = null;
    this.mostrarCanchas = true;
    this.mostrarReservasE = false;
  }

  abrirModalEliminar(cancha: any) {
    this.canchaAEliminar = cancha;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('modalEliminarCancha'));
    modal.show();
  }

  eliminarCanchaConfirmada() {
    if (!this.canchaAEliminar) return;
    this.canchaService.eliminarCancha(this.canchaAEliminar.id).subscribe({
      next: () => {
        this.canchaAEliminar = null;
        this.mostrarVerCanchas();
      },
      error: (err) => {
        this.alerta.showAlert('Error al eliminar la cancha');
        console.error(err);
      }
    });
  }

  mostrarCrearCancha() {
    this.mostrarFormularioCrear = true;
    this.mostrarCanchas = false;
    this.mostrarFormularioEditar = false;
    this.mostrarReservasE = false;
  }

  mostrarVerCanchas() {
    this.mostrarFormularioCrear = false;
    this.mostrarFormularioEditar = false;
    this.mostrarReservasE = false;
    this.mostrarCanchas = true;
    this.canchaService.obtenerCanchasPorDueno(this.usuarioId).subscribe({
      next: (data) => this.canchasUsuario = data,
      error: (err) => console.error('Error al obtener las canchas del usuario:', err)
    })
  }

  mostrarReservas() {
    this.mostrarFormularioCrear = false;
    this.mostrarCanchas = false;
    this.mostrarFormularioEditar = false;
    this.mostrarReservasE = true;
  }
}

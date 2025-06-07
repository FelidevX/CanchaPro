import { Component } from '@angular/core';
import { CanchaService } from '../../../core/services/cancha.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

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
  mostrarAdministracion = false;
  mostrarCanchas = false;
  mostrarFormularioEditar = false;
  
  guardarCancha() {
  
    this.cancha.id_dueno = Number(localStorage.getItem('user_id'));
    console.log('Objeto enviado:', this.cancha);

    this.canchaService.crearCancha(this.cancha).subscribe({
      next: (response) => {
        alert('Cancha creada exitosamente');
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
        alert('Error al guardar la cancha');
        console.error('Error backend:', err);
      }
    })
  }

  editarCancha(cancha: any) {
  this.canchaEditando = { ...cancha }; // Copia para editar
  this.mostrarFormularioEditar = true;
  this.mostrarFormularioCrear = false;
  this.mostrarCanchas = false;
  }

  guardarEdicionCancha() {
    this.canchaService.actualizarCancha(this.canchaEditando).subscribe({
    next: () => {
      // Actualiza la lista de canchas
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
  }

  abrirModalEliminar(cancha: any) {
    console.log('Abriendo modal para:', cancha);
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
        alert('Error al eliminar la cancha');
        console.error(err);
      }
    });
  }

  mostrarCrearCancha() {
    this.mostrarFormularioCrear = true;
    this.mostrarAdministracion = false;
    this.mostrarCanchas = false;
    this.mostrarFormularioEditar = false;
  }

  mostrarVerCanchas() {
    this.mostrarFormularioCrear = false;
    this.mostrarAdministracion = false;
    this.mostrarFormularioEditar = false;
    this.mostrarCanchas = true;
    this.canchaService.obtenerCanchasPorDueno(this.usuarioId).subscribe({
      next: (data) => this.canchasUsuario = data,
      error: (err) => console.error('Error al obtener las canchas del usuario:', err)
    })
  }

  mostrarAdministrar() {
    this.mostrarFormularioCrear = false;
    this.mostrarAdministracion = true;
    this.mostrarCanchas = false;
  }
}

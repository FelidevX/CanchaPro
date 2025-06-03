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
    id_dueno: Number(localStorage.getItem('user_id'))
  }

   constructor(private canchaService: CanchaService) {}

  mostrarFormularioCrear = true;
  mostrarAdministracion = false;
  
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
          id_dueno: Number(localStorage.getItem('user_id'))
        }
      },
      error: (err) => {
        alert('Error al guardar la cancha');
        console.error('Error backend:', err);
      }
    })
  }

  mostrarCrearCancha() {
    this.mostrarFormularioCrear = true;
    this.mostrarAdministracion = false;
  }

  mostrarAdministrar() {
    this.mostrarFormularioCrear = false;
    this.mostrarAdministracion = true;
  }
}

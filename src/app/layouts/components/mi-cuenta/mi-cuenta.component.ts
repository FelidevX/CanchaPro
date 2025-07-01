import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.component.html',
  styleUrl: './mi-cuenta.component.css'
})
export class MiCuentaComponent implements OnInit {
  usuario: User = {
    id: 0,
    email: '',
    name: '',
    lastName: '',
    role: '',
    telefono: '',
    position: ''
  };
  isLoading: boolean = true;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('user_id'));
    if (userId) {
      this.userService.obtenerUsuarioPorId(userId).subscribe({
        next: (data: User) => {
          this.usuario = data;
          console.log('Datos del usuario cargados:', this.usuario);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al obtener los datos del usuario:', err);
          alert('No se pudieron cargar los datos del usuario. Por favor, inténtalo de nuevo más tarde.');
        }
      })
    }
    
  }

  actualizarDatos() {
    // Crear un objeto solo con los campos que necesita el backend
    const datosActualizar = {
      id: this.usuario.id,
      name: this.usuario.name,
      lastName: this.usuario.lastName,
      telefono: this.usuario.telefono,
      position: this.usuario.position
    };


    this.userService.actualizarUsuario(datosActualizar as User).subscribe({
      next: (data: User) => {
        alert('Datos actualizados exitosamente!');
        this.usuario = { ...this.usuario, ...data };
      },
      error: (err) => {
        console.error('Error al actualizar los datos del usuario:', err);
        alert('No se pudieron actualizar los datos del usuario. Por favor, inténtalo de nuevo más tarde.');
      }
    });
  }

}

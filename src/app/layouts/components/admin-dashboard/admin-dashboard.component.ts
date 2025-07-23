import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  usuarios: any[] = [];
  usuarioEditando: any = null;
  roles: string[] = ['jugador', 'dueno', 'admin'];
  mostrarGestionUsuario = true;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.userService.obtenerUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: () => alert('Error al cargar usuarios')
    });
  }

  editarUsuario(usuario: any) {
    this.usuarioEditando = { ...usuario };
  }

  guardarRol() {
    this.userService.actualizarRolUsuario(this.usuarioEditando.id, this.usuarioEditando.role).subscribe({
      next: (data) => {
        const index = this.usuarios.findIndex(u => u.id === this.usuarioEditando.id);
        if (index !== -1) {
          this.usuarios[index].role = this.usuarioEditando.role;
        }
        this.usuarioEditando = null;
        this.cargarUsuarios();
      },
      error: () => alert('Error al actualizar rol')
    });
  }

  cancelarEdicion() {
    this.usuarioEditando = null;
  }

  mostrarGestionUsuarios() {
    this.mostrarGestionUsuario = true;
  }
}

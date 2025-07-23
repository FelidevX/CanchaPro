import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { EquipoService } from '../../../core/services/equipo.service';
import { AlertsComponent } from '../alerts/alerts.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild(AlertsComponent) alerta!: AlertsComponent;
  usuarios: any[] = [];
  usuarioEditando: any = null;
  roles: string[] = ['jugador', 'dueno', 'admin'];
  mostrarGestionUsuario = true;
  mostrarSolicitudes = false;
  partidosPendientes: any[] = [];
  

  constructor(
    private userService: UserService,
    private equipoService: EquipoService,
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarPartidosPendientes();
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
    this.mostrarSolicitudes = false;
  }

  mostrarSolicitudDueno() {
    this.mostrarGestionUsuario = false;
    this.mostrarSolicitudes = true;
  }

  cargarPartidosPendientes() {
    this.equipoService.obtenerPartidosPendientes().subscribe({
      next: (data) => this.partidosPendientes = data,
      error: () => this.alerta.showAlert('Error al cargar partidos pendientes', 'danger')
    });
  }

  aprobarResultado(id: number) {
    this.equipoService.aprobarResultado(id).subscribe(() => {
      this.cargarPartidosPendientes();
      this.alerta.showAlert('Resultado aprobado', 'success');
    });
  }

  rechazarResultado(id: number) {
    this.equipoService.rechazarResultado(id).subscribe(() => {
      this.cargarPartidosPendientes();
      this.alerta.showAlert('Resultado rechazado', 'warning');
    });
  }
}

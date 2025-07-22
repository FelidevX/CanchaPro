import { Component, OnInit, ViewChild } from '@angular/core';
import { CanchaService } from '../../../core/services/cancha.service';
import { Reserva } from '../../../core/models/reserva.model';
import { ReservaService } from '../../../core/services/reserva.service';
import { AlertsComponent } from '../alerts/alerts.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-canchas-list',
  templateUrl: './canchas-list.component.html',
  styleUrl: './canchas-list.component.css'
})
export class CanchasListComponent implements OnInit{
  @ViewChild(AlertsComponent) alerta!: AlertsComponent;
  canchas: any[] = [];
  canchaSeleccionada: any = null;
  reserva: Reserva = {
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    id_usuario: Number(localStorage.getItem('user_id')),
    id_cancha: 0,
    estado: 'Confirmada'
  }
  usuarioLogueado: boolean = false;

  constructor(private canchaService: CanchaService, private reservaService: ReservaService, private http: HttpClient){}

  abrirReserva(cancha: any): void {
    if(!this.usuarioLogueado) {
      this.alerta.showAlert('Debes iniciar sesión para reservar una cancha.', 'danger');
      return;
    }
    this.canchaSeleccionada = cancha;
    this.reserva = {
      fecha: '',
      hora_inicio: '',
      hora_fin: '',
      id_usuario: Number(localStorage.getItem('user_id')),
      id_cancha: cancha.id,
      estado: 'Confirmada'
    }
  }

  cerrarReserva(): void {
    this.canchaSeleccionada = null;
  }

  reservar() {
    if (!this.usuarioLogueado) {
      this.alerta.showAlert('Debes iniciar sesión para realizar una reserva.', 'danger');
      return;
    }

    if (!this.reserva.fecha) {
      this.alerta.showAlert('Debes seleccionar una fecha.', 'warning');
      return;
    }
    if (!this.reserva.hora_inicio) {
      this.alerta.showAlert('Debes seleccionar una hora de inicio.', 'warning');
      return;
    }
    if (!this.reserva.hora_fin) {
      this.alerta.showAlert('Debes seleccionar una hora de fin.', 'warning');
      return;
    }

    const [year, month, day] = this.reserva.fecha.split('-').map(Number);
    const fechaSeleccionada = new Date(year, month - 1, day);

    const hoy = new Date();
    const fechaHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    if (isNaN(fechaSeleccionada.getTime())) {
      this.alerta.showAlert('La fecha seleccionada no es válida.', 'danger');
      return;
    }

    if (fechaSeleccionada < fechaHoy) {
      this.alerta.showAlert('No puedes reservar en días anteriores a hoy.', 'danger');
      return;
    }

    // Valida que la hora de inicio no sea anterior a la actual
    if (fechaSeleccionada.getTime() === fechaHoy.getTime()) {
      const [h, m] = this.reserva.hora_inicio.split(':');
      const reservaDate = new Date(fechaSeleccionada);
      reservaDate.setHours(Number(h), Number(m), 0, 0);

      if (reservaDate < hoy) {
        this.alerta.showAlert('No puedes reservar en una hora anterior a la actual.', 'danger');
        return;
      }
    }

    if (this.reserva.hora_inicio >= this.reserva.hora_fin) {
      this.alerta.showAlert('La hora de inicio debe ser anterior a la hora de fin.', 'danger');
      return;
    }
    const diff =
      (+this.reserva.hora_fin.split(':')[0] - +this.reserva.hora_inicio.split(':')[0]) +
      (+this.reserva.hora_fin.split(':')[1] - +this.reserva.hora_inicio.split(':')[1]) / 60;
    if (diff < 1) {
      this.alerta.showAlert('La reserva debe ser de al menos una hora', 'warning');
      return;
    }

    console.log('precio:', this.canchaSeleccionada.precio);

    // En vez de crear la reserva directamente, solicita la URL de pago
    this.http.post<{ url: string }>('https://backend-canchapro.onrender.com/reservas/pago', { precio: this.canchaSeleccionada.precio })
      .subscribe({
        next: (res) => {
          window.location.href = res.url;
        },
        error: () => {
          this.alerta.showAlert('Error al iniciar el pago', 'danger');
        }
      });
      localStorage.setItem('reservaPendiente', JSON.stringify(this.reserva));
  }

  ngOnInit(): void {
    this.usuarioLogueado = !!localStorage.getItem('access_token');
    this.canchaService.obtenerCanchas().subscribe({
        next: (data) => this.canchas = data,
        error: (err) => console.error('Error al obtener las canchas:', err)
      });
  }

}

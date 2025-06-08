import { Component, OnInit } from '@angular/core';
import { CanchaService } from '../../../core/services/cancha.service';
import { Reserva } from '../../../core/models/reserva.model';
import { ReservaService } from '../../../core/services/reserva.service';

@Component({
  selector: 'app-canchas-list',
  templateUrl: './canchas-list.component.html',
  styleUrl: './canchas-list.component.css'
})
export class CanchasListComponent implements OnInit{
  canchas: any[] = [];
  canchaSeleccionada: any = null;
  reserva: Reserva = {
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    id_usuario: Number(localStorage.getItem('user_id')),
    id_cancha: 0,
    estado: 'ocupado'
  }

  constructor(private canchaService: CanchaService, private reservaService: ReservaService){}

  abrirReserva(cancha: any): void {
    this.canchaSeleccionada = cancha;
    this.reserva = {
      fecha: '',
      hora_inicio: '',
      hora_fin: '',
      id_usuario: Number(localStorage.getItem('user_id')),
      id_cancha: cancha.id,
      estado: 'ocupado'
    }
  }

  cerrarReserva(): void {
    this.canchaSeleccionada = null;
  }

  reservar() {
    if (!this.reserva.fecha) {
      alert('Debes seleccionar una fecha.');
      return;
    }
    if (!this.reserva.hora_inicio) {
      alert('Debes seleccionar una hora de inicio.');
      return;
    }
    if (!this.reserva.hora_fin) {
      alert('Debes seleccionar una hora de fin.');
      return;
    }

    const [year, month, day] = this.reserva.fecha.split('-').map(Number);
    const fechaSeleccionada = new Date(year, month - 1, day);

    const hoy = new Date();
    const fechaHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    if (isNaN(fechaSeleccionada.getTime())) {
      alert('La fecha seleccionada no es válida.');
      return;
    }

    if (fechaSeleccionada < fechaHoy) {
      alert('No puedes reservar en días anteriores a hoy.');
      return;
    }

    // Valida que la hora de inicio no sea anterior a la actual
    if (fechaSeleccionada.getTime() === fechaHoy.getTime()) {
      const [h, m] = this.reserva.hora_inicio.split(':');
      const reservaDate = new Date(fechaSeleccionada);
      reservaDate.setHours(Number(h), Number(m), 0, 0);

      if (reservaDate < hoy) {
        alert('No puedes reservar en una hora anterior a la actual.');
        return;
      }
    }

    if (this.reserva.hora_inicio >= this.reserva.hora_fin) {
      alert('La hora de inicio debe ser anterior a la hora de fin.');
      return;
    }
    const diff =
      (+this.reserva.hora_fin.split(':')[0] - +this.reserva.hora_inicio.split(':')[0]) +
      (+this.reserva.hora_fin.split(':')[1] - +this.reserva.hora_inicio.split(':')[1]) / 60;
    if (diff < 1) {
      alert('La reserva debe ser de al menos una hora');
      return;
    }

    this.reservaService.crearReserva(this.reserva).subscribe({
      next: () => {
        alert('Reserva creada exitosamente');
        this.cerrarReserva();
      },
      error: (err) => {
        if (err.status === 400) {
          alert('La cancha ya está reservada en ese horario.');
        } else {
          alert('Error al crear la reserva, intenta nuevamente');
        }
      }
    });
  }

  ngOnInit(): void {
      this.canchaService.obtenerCanchas().subscribe({
        next: (data) => this.canchas = data,
        error: (err) => console.error('Error al obtener las canchas:', err)
      });
  }

}

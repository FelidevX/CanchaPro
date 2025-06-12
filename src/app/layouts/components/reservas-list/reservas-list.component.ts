import { Component, Input, OnInit } from '@angular/core';
import { ReservaService } from '../../../core/services/reserva.service';

@Component({
  selector: 'app-reservas-list',
  templateUrl: './reservas-list.component.html',
  styleUrls: ['./reservas-list.component.css']
})
export class ReservasListComponent implements OnInit {
  @Input() canchas: any[] = [];
  @Input() idDueno: string = '';
  reservas: any[] = [];

  canchaSeleccionada: string = '';
  fechaSeleccionada: string = '';

  detalleReserva: any = null;
  mostrarModalDetalle: boolean = false;

  constructor(private reservaService: ReservaService) {}

  ngOnInit() {
    if (this.idDueno) {
      this.cargarReservasPorDueno(this.idDueno);
    }
  }

  cargarReservasPorDueno(idDueno: string) {
    this.reservaService.obtenerReservasPorDueno(idDueno).subscribe({
      next: (data) => this.reservas = data,
      error: () => this.reservas = []
    });
  }

  get reservasFiltradas() {
    return this.reservas.filter(r =>
      (!this.canchaSeleccionada || r.id_cancha == +this.canchaSeleccionada) &&
      (!this.fechaSeleccionada || (new Date(r.fecha).toISOString().slice(0,10) === this.fechaSeleccionada))
    );
  }

  limpiarFiltros() {
    this.canchaSeleccionada = '';
    this.fechaSeleccionada = '';
  }

  verDetalle(reserva: any) {
    this.detalleReserva = reserva;
    this.mostrarModalDetalle = true;
  }

  cerrarModalDetalle() {
    this.mostrarModalDetalle = false;
    this.detalleReserva = null;
  }

  cancelarReserva(reserva: any) {
    const reservaActualizada = { ...reserva, estado: 'Cancelada' };
    this.reservaService.actualizarReserva(reservaActualizada).subscribe({
      next: () => {
        reserva.estado = 'Cancelada';
      },
      error: () => {
        alert('No se pudo cancelar la reserva. Intenta de nuevo.');
      }
    });
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'Confirmada':
        return 'badge bg-success';
      case 'Pendiente':
        return 'badge bg-warning';
      case 'Cancelada':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }
}

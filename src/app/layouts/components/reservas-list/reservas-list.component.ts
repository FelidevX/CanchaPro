import { Component, Input, OnInit } from '@angular/core';
import { ReservasService } from '../../../core/services/reservas.service';

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

  constructor(private reservasService: ReservasService) {}

  ngOnInit() {
      console.log('ID dueño:', this.idDueno);
    if (this.idDueno) {
      this.cargarReservasPorDueno(this.idDueno);
    }
  }

  cargarReservasPorDueno(idDueno: string) {
    this.reservasService.obtenerReservasPorDueno(idDueno).subscribe({
      next: (data) => this.reservas = data,
      error: () => this.reservas = []
    });
  }

  get reservasFiltradas() {
    return this.reservas.filter(r =>
      (!this.canchaSeleccionada || r.id_cancha == this.canchaSeleccionada) &&
      (!this.fechaSeleccionada || (new Date(r.fecha).toISOString().slice(0,10) === this.fechaSeleccionada))
    );
  }

  limpiarFiltros() {
    this.canchaSeleccionada = '';
    this.fechaSeleccionada = '';
  }

  verDetalle(reserva: any) {
    alert('Detalle de reserva:\n' + JSON.stringify(reserva, null, 2));
  }

  cancelarReserva(reserva: any) {
    reserva.estado = 'Cancelada';
  }
}

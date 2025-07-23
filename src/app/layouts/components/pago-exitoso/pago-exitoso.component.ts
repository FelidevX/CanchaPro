import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../../../core/services/reserva.service';

@Component({
  selector: 'app-pago-exitoso',
  templateUrl: './pago-exitoso.component.html',
  styleUrl: './pago-exitoso.component.css'
})
export class PagoExitosoComponent implements OnInit {

  constructor(private reservaService: ReservaService) {}

  ngOnInit() {
  const reserva = JSON.parse(localStorage.getItem('reservaPendiente') || '{}');
  console.log('Reserva a guardar:', reserva); // <-- Agrega esto
  if (reserva && reserva.fecha) {
    this.reservaService.crearReserva(reserva).subscribe({
      next: () => {
        localStorage.removeItem('reservaPendiente');
        // ...mostrar alerta o redirigir...
      },
      error: (err) => {
        console.error('Error al guardar reserva:', err); // <-- Agrega esto
      }
    });
  }
}

}

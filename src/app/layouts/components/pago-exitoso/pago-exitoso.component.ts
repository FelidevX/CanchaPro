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
  if (reserva && reserva.fecha) {
    this.reservaService.crearReserva(reserva).subscribe({
      next: () => {
        // Muestra mensaje de éxito y limpia localStorage
        localStorage.removeItem('reservaPendiente');
        // ...mostrar alerta o redirigir...
      },
      error: () => {
        // ...mostrar error...
      }
    });
  }
}

}

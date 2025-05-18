import { Component } from '@angular/core';

@Component({
  selector: 'app-canchas-destacadas',
  templateUrl: './canchas-destacadas.component.html',
  styleUrl: './canchas-destacadas.component.css'
})
export class CanchasDestacadasComponent {
  canchas = [
    {
      nombre: 'Campo Deportivo El Gol',
      ubicacion: 'Santiago Centro',
      precio: 45000,
      rating: 4.8
    },
    {
      nombre: 'Canchas La Victoria',
      ubicacion: 'Providencia',
      precio: 50000,
      rating: 4.6
    },
    {
      nombre: 'Estadio Futbolito',
      ubicacion: 'Las Condes',
      precio: 60000,
      rating: 4.9
    }
  ];
}

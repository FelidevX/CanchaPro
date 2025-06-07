import { Component, OnInit } from '@angular/core';
import { CanchaService } from '../../../core/services/cancha.service';

@Component({
  selector: 'app-canchas-destacadas',
  templateUrl: './canchas-destacadas.component.html',
  styleUrl: './canchas-destacadas.component.css'
})
export class CanchasDestacadasComponent implements OnInit {
  canchas: any[] = [];

  constructor(private canchaService: CanchaService) { }

  ngOnInit(): void {
      this.canchaService.obtenerCanchas().subscribe({
        next: (data: any) => this.canchas = data,
        error: (err: any) => console.error('Error al obtener las canchas:', err),
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { CanchaService } from '../../../core/services/cancha.service';

@Component({
  selector: 'app-canchas-list',
  templateUrl: './canchas-list.component.html',
  styleUrl: './canchas-list.component.css'
})
export class CanchasListComponent implements OnInit{
  canchas: any[] = [];

  constructor(private canchaService: CanchaService){}

  ngOnInit(): void {
      this.canchaService.obtenerCanchas().subscribe({
        next: (data) => this.canchas = data,
        error: (err) => console.error('Error al obtener las canchas:', err)
      });
  }

}

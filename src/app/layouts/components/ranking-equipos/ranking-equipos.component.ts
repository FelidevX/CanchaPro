import { Component, OnInit } from '@angular/core';
import { EquipoService } from '../../../core/services/equipo.service';

@Component({
  selector: 'app-ranking-equipos',
  templateUrl: './ranking-equipos.component.html',
  styleUrl: './ranking-equipos.component.css'
})
export class RankingEquiposComponent implements OnInit {
  ranking: any[] = [];
  loading = true;

  constructor(private equipoService: EquipoService) {}

  ngOnInit() {
    this.equipoService.obtenerRankingEquipos().subscribe({
      next: (equipos) => {
        // Calcula el porcentaje de victoria y diferencia de goles
        this.ranking = equipos.map((e: any) => ({
          ...e,
          porcentaje: e.partidos_jugados > 0 ? Math.round((e.partidos_ganados / e.partidos_jugados) * 100) : 0,
          diferencia: e.goles_favor - e.goles_contra
        }))
        // Ordena por porcentaje y luego por diferencia de goles
        .sort((a: any, b: any) => 
          b.porcentaje - a.porcentaje || b.diferencia - a.diferencia
        );
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}

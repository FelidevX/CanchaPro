import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css'
})
export class CallbackComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const userId = params['userId'];

      if (token && userId) {
        this.authService.getUserInfo(token).subscribe({
          next: (user) => {
            this.authService.setSession(token, user);
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Error al obtener información del usuario:', error);
            this.router.navigate(['/auth/login']);
          }
        });
      } else {
        console.error('No se recibieron los parámetros necesarios');
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  logoPath = 'assets/LogoCanchaPRO.png';
  isAuthenticated = false;
  private authSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Verificar el estado inicial de autenticación
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    // Suscribirse a los cambios en el estado de autenticación
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(): void {
    // Limpiar la suscripción cuando el componente se destruye
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  onLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  onLogout(): void {
    this.authService.logout();
  }
}

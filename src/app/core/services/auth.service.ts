import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User, LoginCredentials, RegisterData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Verificar si hay un token al iniciar el servicio
    const token = localStorage.getItem('access_token');
    if (token) {
      this.verifySession();
    }
  }

  // Login tradicional
  login(credentials: LoginCredentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setSession(response.token, response.user);
        }
      })
    );
  }

  // Registro de usuario
  register(userData: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  // Login con Google
  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  // Verificar la sesión actual
  verifySession(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.getUserInfo(token).subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  // Obtener información del usuario
  getUserInfo(token: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`, {
      headers: { authorization: `Bearer ${token}` }
    });
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Obtener el rol del usuario actual
  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  // Guardar información de la sesión
  setSession(token: string, user: User): void {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_role', user.role);
    localStorage.setItem('user_id', user.id.toString());
    this.currentUserSubject.next(user);
  }
}

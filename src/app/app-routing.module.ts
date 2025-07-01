import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/components/main-layout/main-layout.component';
import { CallbackComponent } from './layouts/components/callback/callback.component';
import { LoginComponent } from './layouts/components/login/login.component';
import { RegisterComponent } from './layouts/components/register/register.component';
import { AuthLayoutComponent } from './layouts/components/auth-layout/auth-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './layouts/components/dashboard/dashboard.component';
import { CanchasListComponent } from './layouts/components/canchas-list/canchas-list.component';
import { EquiposComponent } from './layouts/components/equipos/equipos.component';
import { MiCuentaComponent } from './layouts/components/mi-cuenta/mi-cuenta.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'callback',
        component: CallbackComponent
      }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'manage',
    component: AuthLayoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'canchas',
    component: CanchasListComponent
  },
  {
    path: 'equipos',
    component: EquiposComponent
  },
  {
    path: 'perfil',
    component: MiCuentaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

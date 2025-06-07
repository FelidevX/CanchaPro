import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/components/header/header.component';
import { FooterComponent } from './layouts/components/footer/footer.component';
import { MainLayoutComponent } from './layouts/components/main-layout/main-layout.component';
import { CanchaBannerComponent } from './layouts/components/cancha-banner/cancha-banner.component';
import { CanchasDestacadasComponent } from './layouts/components/canchas-destacadas/canchas-destacadas.component';
import { CallbackComponent } from './layouts/components/callback/callback.component';
import { LoginComponent } from './layouts/components/login/login.component';
import { RegisterComponent } from './layouts/components/register/register.component';
import { AuthLayoutComponent } from './layouts/components/auth-layout/auth-layout.component';
import { DashboardComponent } from './layouts/components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainLayoutComponent,
    CanchaBannerComponent,
    CanchasDestacadasComponent,
    CallbackComponent,
    LoginComponent,
    RegisterComponent,
    AuthLayoutComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

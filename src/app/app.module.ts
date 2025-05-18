import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/components/header/header.component';
import { FooterComponent } from './layouts/components/footer/footer.component';
import { MainLayoutComponent } from './layouts/components/main-layout/main-layout.component';
import { CanchaBannerComponent } from './layouts/components/cancha-banner/cancha-banner.component';
import { CanchasDestacadasComponent } from './layouts/components/canchas-destacadas/canchas-destacadas.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainLayoutComponent,
    CanchaBannerComponent,
    CanchasDestacadasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { MenuComponent } from './views/menu/menu.component';
import { HttpClientModule } from '@angular/common/http';
import { UserComponent } from './modules/user/user.component';
import { AuthService } from './modules/auth/services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from './modules/auth/auth.module';
import { GrapherModule } from './modules/grapher/grapher.module';
import { CoreModule } from './modules/core/core.module';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { AccountComponent } from './modules/user/views/account/account.component';
import { SharedModule } from './modules/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainComponent,
    MenuComponent,
    UserComponent,
    MainToolbarComponent,
    AccountComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    GrapherModule,
    AuthModule,
    CoreModule
  ],
  providers: [
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookiesService } from './services/cookies.service';
import { HttpService } from './services/http.service';
import { LocalStorageService } from './services/local-storage.service';
import { SessionStorageService } from './services/session-storage.service';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { MaterialModule } from '../material/material.module';
import { LoaderComponent } from './views/loader/loader.component';
import { FilterPipe } from './pipes/filter.pipe';
import { VarDirective } from './directives/ng-var.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IndexValuePipe } from './pipes/index-value.pipe';

@NgModule({
  providers: [
    CookiesService,
    HttpService,
    LocalStorageService,
    SessionStorageService,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  exports: [
    LoaderComponent,
    SafeUrlPipe,
    FilterPipe,
    IndexValuePipe,
    VarDirective,
    // EditableDirective
  ],
  declarations: [
    LoaderComponent,
    SafeUrlPipe,
    FilterPipe,
    IndexValuePipe,
    VarDirective,
    // EditableDirective
  ],
})
export class SharedModule { }

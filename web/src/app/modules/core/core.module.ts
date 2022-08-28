import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleHubComponent } from './views/module-hub/module-hub.component';
import { MaterialModule } from '../material/material.module';
import { CoreRoutingModule } from './core-routing.module';



@NgModule({
  declarations: [
    ModuleHubComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CoreRoutingModule
  ]
})
export class CoreModule { }

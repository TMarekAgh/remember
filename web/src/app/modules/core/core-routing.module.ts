import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleHubComponent } from './views/module-hub/module-hub.component';

const routes: Routes = [
  {
    path: 'hub',
    component: ModuleHubComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }

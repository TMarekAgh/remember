import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedGuard } from '../auth/guards/logged.guard';
import { GraphContainerComponent } from './views/graph-container/graph-container.component';

const routes: Routes = [
  {
    path: 'grapher/:id',
    component: GraphContainerComponent,
    canActivate: [LoggedGuard]
  },
  {
    path: 'grapher',
    component: GraphContainerComponent,
    canActivate: [LoggedGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrapherRoutingModule { }

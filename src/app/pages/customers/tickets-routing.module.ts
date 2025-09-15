import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages
import { ListComponent } from "./list/list.component";
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { ReconcileIdComponent } from './reconcile-id/reconcile-id.component';

const routes: Routes = [
  {
    path:"",
    redirectTo:"list",
    pathMatch:'full'
  },
  {
    path:"list",
    component: ListComponent
  },
  {
    path:"details/:id",
    component: CustomerDetailsComponent
  },
  {
    path:"reconcile-id/:id",
    component: ReconcileIdComponent
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketsRoutingModule {}

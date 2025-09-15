import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationStatusComponent } from './application-status/application-status.component';
import { IntegrationStatusComponent } from './integration-status/integration-status.component';

const routes: Routes = [
  {
    path: "individual-applications",
    component: ApplicationStatusComponent,
  },
  {
    path: "integration-status",
    component:IntegrationStatusComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationStatusRoutingModule { }

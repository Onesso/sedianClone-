import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component Pages
import { AnalyticsComponent } from "./analytics/analytics.component";
import { CrmComponent } from "./crm/crm.component";
import { ProjectsComponent } from "./projects/projects.component";
import { JobComponent } from './job/job.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  {
    path: "",
    redirectTo: "analytics",
    pathMatch: "full"
  },
  {
    path: "analytics",
    component: DashboardComponent
  },
  {
    path: "crm",
    component: CrmComponent
  },
  {
    path: "projects",
    component: ProjectsComponent
  },
  {
    path: "job",
    component: JobComponent
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardsRoutingModule { }

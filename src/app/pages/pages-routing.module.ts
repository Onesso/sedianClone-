import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component pages


const routes: Routes = [
    
          {  
            path: "",
            redirectTo:'dashboard',
            pathMatch:'full'  
          },    
          {
            path: 'dashboard', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
          },
          {
            path: 'accounts', loadChildren: () => import('./accounts/accounts.module').then(m => m.AccountsModule)
          }, 
          {
            path: 'customers', loadChildren: () => import('./customers/tickets.module').then(m => m.TicketsModule)
          }, 
          {
            path: 'exception', loadChildren: () => import('./exceptions/exceptions.module').then(m => m.ExceptionsModule)
          }, 
          {
            path: 'product-setup', loadChildren: () => import('./product-setup/product-setup.module').then(m => m.ProductSetupModule)
          }, 
          {
            path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
          }, 
          {
            path: 'application-status', loadChildren: () => import('./application-status/application-status.module').then(m => m.ApplicationStatusModule)
          }, 
          {
            path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
          }, 
          {
            path: 'system-users', loadChildren: () => import('./system-users/system-users.module').then(m => m.SystemUsersModule)
          },   
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }

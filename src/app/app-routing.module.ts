import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layouts/layout.component';

// Auth
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
     path: 'app',
    data:{},
    component: LayoutComponent,
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    // canActivate: [AuthGuard]
  },
  { path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)  },
  { path: 'landing', loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

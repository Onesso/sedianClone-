import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { NewUserComponent } from './new-user/new-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { NewRoleComponent } from './new-role/new-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { NewAffiliateComponent } from './new-affiliate/new-affiliate.component';
import { EditAffiliatesComponent } from './edit-affiliates/edit-affiliates.component';
import { AffiliatesTableComponent } from './affiliates/affiliates-table/affiliates-table.component';

const routes: Routes = [
  {
    path: 'all',
    component: UsersComponent
  },
  {
    path: 'roles',
    component: RolesComponent
  },
  {
    path: 'new-user',
    component: NewUserComponent
  },
  {
    path: 'new-affiliate',
    component: NewAffiliateComponent
  },
  {
    path: 'edit-user/:id',
    component: EditUserComponent
  },
  {
    path: 'edit-affiliate/:id',
    component: EditAffiliatesComponent
  },
  {
    path: 'new-role',
    component: NewRoleComponent
  },
  {
    path: 'edit-role/:id',
    component: EditRoleComponent
  },
  {
    path: 'affiliates',
    component: AffiliatesTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemUsersRoutingModule { }

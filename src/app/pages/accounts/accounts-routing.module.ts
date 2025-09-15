import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component pages

import { AccountsListComponent } from './acounts-list/accounts-list.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { JointAccountsComponent } from './joint-accounts/joint-accounts.component';
import { ChildAccountsComponent } from './child-accounts/child-accounts.component';
import { PendingAccountsComponent } from './pending-accounts/pending-accounts.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "list",
    pathMatch:'full'
  },
 
  {
    path: "list",
    component: AccountsListComponent
  },
  {
    path: "nawiri-accounts",
    component: JointAccountsComponent
  },
  {
    path: "mshahara-accounts",
    component: ChildAccountsComponent,
    data: {
      accountType: "Mshahara Account"
    },
  },
  {
    path: "savings-accounts",
    component: ChildAccountsComponent,
    data: {
      accountType: "Savings Account"
    },
  },
  {
    path: "pending-accounts",
    component: PendingAccountsComponent
  },
  {
    path: "account-details/:tag/:id",
    component: AccountDetailsComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }

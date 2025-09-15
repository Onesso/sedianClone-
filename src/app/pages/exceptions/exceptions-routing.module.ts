import { PepDetalsComponent } from './pep-detals/pep-detals.component';
import { KraDetalsComponent } from './kra-detals/kra-detals.component';
import { ComplianceDetalsComponent } from './compliance-detals/compliance-detals.component';
import { T24DetalsComponent } from './t24-detals/t24-detals.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExceptionComponent } from './exception.component';
import { KraExcetionsComponent } from './kra-excetions/kra-excetions.component';
import { IprsExceptionsComponent } from './iprs-exceptions/iprs-exceptions.component';
import { ComplianceExceptionsComponent } from './compliance-exceptions/compliance-exceptions.component';
import { T24ExcetionsComponent } from './t24-excetions/t24-excetions.component';
import { PepExceptionsComponent } from './pep-exceptions/pep-exceptions.component';
import { IprsDetailsComponent } from './iprs-details/iprs-details.component';
import { PendingApprovalsComponent } from './pending-approvals/pending-approvals.component';
import { PendingApprovalDetailsComponent } from './pending-approval-details/pending-approval-details.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "categories",
    pathMatch:'full'
  },
  {
    path: "categories",
    component: ExceptionComponent,
  },
  {
    path: "kra/:id",
    component: KraExcetionsComponent,
  },
  {
    path: "kra-details/:id/:code",
    component: KraDetalsComponent,
  },
  {
    path: "iprs/:id",
    component: IprsExceptionsComponent,
  },
  {
    path: "iprs-details/:id/:code",
    component: IprsDetailsComponent,
  },
  {
    path: "compliance/:id",
    component: ComplianceExceptionsComponent,
  },
  {
    path: "compliance-details/:id/:code",
    component: ComplianceDetalsComponent,
  },
  {
    path: "t24/:id",
    component: T24ExcetionsComponent,
  },
  {
    path: "t24-details/:id/:code",
    component: T24DetalsComponent,
  },
  {
    path: "pep/:id",
    component: PepExceptionsComponent,
  },
  {
    path: "pep-details/:id/:code",
    component: PepDetalsComponent,
  },
  {
    path: "pending-approval/:queue/:id/:code",
    component: PendingApprovalDetailsComponent,
  },
  {
    path: "pedding-approvals",
    component: PendingApprovalsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExceptionsRoutingModule { }

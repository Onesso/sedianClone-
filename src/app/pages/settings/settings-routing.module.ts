import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchesComponent } from './branches/branches.component';
import { CountryComponent } from './country/country.component';
import { EmployerComponent } from './employer/employer.component';
import { IncomeRangeComponent } from './income-range/income-range.component';
import { MessagesComponent } from './messages/messages.component';
import { CurrencyComponent } from './currency/currency.component';
import { RejectionTypeComponent } from './rejection-type/rejection-type.component';
import { SectorsComponent } from './sectors/sectors.component';

const routes: Routes = [
  {
    path: "branches",
    component: BranchesComponent,
  },
  {
    path: "countries",
    component:CountryComponent
  },
  {
    path: "employers",
    component: EmployerComponent
  },
  {
    path: "industry-sectors",
    component: SectorsComponent
  },
  {
    path: "income-ranges",
    component: IncomeRangeComponent
  },
  {
    path: "messages",
    component: MessagesComponent
  },
  {
    path: "rejection-types",
    component: RejectionTypeComponent
  },
  {
    path: "currencies",
    component: CurrencyComponent
  }
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }

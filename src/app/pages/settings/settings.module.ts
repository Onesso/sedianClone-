import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { CountryComponent } from './country/country.component';
import { BranchesComponent } from './branches/branches.component';
import { RejectionTypeComponent } from './rejection-type/rejection-type.component';
import { MessagesComponent } from './messages/messages.component';
import { IncomeRangeComponent } from './income-range/income-range.component';
import { EmployerComponent } from './employer/employer.component';
import { CurrencyComponent } from './currency/currency.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTooltipModule, NgbPaginationModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'src/app/shared/shared.module';
import { SectorsComponent } from './sectors/sectors.component';


@NgModule({
  declarations: [
    CountryComponent,
    BranchesComponent,
    RejectionTypeComponent,
    MessagesComponent,
    IncomeRangeComponent,
    EmployerComponent,
    CurrencyComponent,
    SectorsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,

    SharedModule,
    NgApexchartsModule,
    FeatherModule.pick(allIcons),
    NgbDropdownModule,   
    NgbTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    FlatpickrModule,
    NgSelectModule,
    NgbPaginationModule,
    NgbNavModule,   
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SettingsModule { }

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationStatusRoutingModule } from './application-status-routing.module';
import { ApplicationStatusComponent } from './application-status/application-status.component';
import { IntegrationStatusComponent } from './integration-status/integration-status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTooltipModule, NgbPaginationModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ApplicationStatusComponent,
    IntegrationStatusComponent
  ],
  imports: [
    CommonModule,
    ApplicationStatusRoutingModule,

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
export class ApplicationStatusModule { }

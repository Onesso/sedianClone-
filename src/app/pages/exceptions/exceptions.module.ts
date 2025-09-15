import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExceptionsRoutingModule } from './exceptions-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTooltipModule, NgbPaginationModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExceptionComponent } from './exception.component';
import { KraExcetionsComponent } from './kra-excetions/kra-excetions.component';
import { T24ExcetionsComponent } from './t24-excetions/t24-excetions.component';
import { ComplianceExceptionsComponent } from './compliance-exceptions/compliance-exceptions.component';
import { IprsExceptionsComponent } from './iprs-exceptions/iprs-exceptions.component';
import { PepExceptionsComponent } from './pep-exceptions/pep-exceptions.component';
import { IprsDetailsComponent } from './iprs-details/iprs-details.component';
import { LightboxModule } from 'ngx-lightbox';
import { KraDetalsComponent } from './kra-detals/kra-detals.component';
import { ComplianceDetalsComponent } from './compliance-detals/compliance-detals.component';
import { T24DetalsComponent } from './t24-detals/t24-detals.component';
import { PepDetalsComponent } from './pep-detals/pep-detals.component';
import { PhotoGalleryModule } from '@twogate/ngx-photo-gallery';
import { PendingApprovalsComponent } from './pending-approvals/pending-approvals.component';
import { PendingApprovalDetailsComponent } from './pending-approval-details/pending-approval-details.component';
import { CountUpModule } from 'ngx-countup';



@NgModule({
  declarations: [
    ExceptionComponent,
    KraExcetionsComponent,
    T24ExcetionsComponent,
    ComplianceExceptionsComponent,
    IprsExceptionsComponent,
    PepExceptionsComponent,
    IprsDetailsComponent,
    KraDetalsComponent,
    ComplianceDetalsComponent,
    T24DetalsComponent,
    PepDetalsComponent,
    PendingApprovalsComponent,
    PendingApprovalDetailsComponent
  ],
  imports: [
    CommonModule,
    ExceptionsRoutingModule,
    SharedModule,
    NgApexchartsModule,
    FeatherModule.pick(allIcons),
    NgbDropdownModule,
    NgbTooltipModule,
    LightboxModule,
    FormsModule,
    ReactiveFormsModule,
    FlatpickrModule,
    NgSelectModule,
    CountUpModule,
    NgbPaginationModule,
    NgbNavModule,
    PhotoGalleryModule
   
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ExceptionsModule { }

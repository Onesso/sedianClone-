
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ApprovedExceptionsComponent } from './approved-exceptions/approved-exceptions.component';
import { RejectedExceptionsComponent } from './rejected-exceptions/rejected-exceptions.component';
import { IprsLogsComponent } from './iprs-logs/iprs-logs/iprs-logs.component';
import { KraLogsComponent } from './kra-logs/kra-logs.component';
import { FailedIprsComponent } from './failed-iprs/failed-iprs.component';
import { FailedKraComponent } from './failed-kra/failed-kra.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbToastModule, NgbDropdownModule, NgbNavModule, NgbTypeaheadModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CountUpModule } from 'ngx-countup';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { NgPipesModule } from 'ngx-pipes';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SimplebarAngularModule } from 'simplebar-angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { DashboardsRoutingModule } from '../dashboards/dashboards-routing.module';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { DocumentsArchivedComponent } from './documents-archived/documents-archived.component';
import { ReportsPipe } from './reports.pipe';
import { DocumentPipe } from './document.pipe';


@NgModule({
  declarations: [
    ApprovedExceptionsComponent,
    RejectedExceptionsComponent, 
    IprsLogsComponent,
    KraLogsComponent,
    FailedIprsComponent,
    FailedKraComponent,
    DocumentsArchivedComponent,
    ReportsPipe,
    DocumentPipe
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,

    NgbToastModule,
    FeatherModule.pick(allIcons),
    CountUpModule,
    NgbDropdownModule,
    NgbNavModule,
    SimplebarAngularModule,
    NgApexchartsModule,
    NgxEchartsModule.forRoot({ echarts }),
    SlickCarouselModule,
    FlatpickrModule.forRoot(),
    DashboardsRoutingModule,
    SharedModule,
    WidgetModule,
    NgbTypeaheadModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgPipesModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportsModule { 
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}

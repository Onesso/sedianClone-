import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbToastModule, NgbTypeaheadModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { CountUpModule } from 'ngx-countup';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
// Apex Chart Package
import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';
// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';

//Module
import { DashboardsRoutingModule } from "./dashboards-routing.module";
import { SharedModule } from '../../shared/shared.module';
import { WidgetModule } from '../../shared/widget/widget.module';


// Component
import { AnalyticsComponent } from './analytics/analytics.component';
import { CrmComponent } from './crm/crm.component';
import { ProjectsComponent } from './projects/projects.component';
import { JobComponent } from './job/job.component';
import { IprsLogsComponent } from '../reports/iprs-logs/iprs-logs/iprs-logs.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { KraLogsComponent } from '../reports/kra-logs/kra-logs.component';

// Load Icon
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  declarations: [
    AnalyticsComponent,
    CrmComponent,
    ProjectsComponent,
    JobComponent,   
    DashboardComponent,
  
  ],
  imports: [
    CommonModule,
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
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers:[DatePipe]
})
export class DashboardsModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
 }

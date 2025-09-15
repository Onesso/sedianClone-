import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemUsersRoutingModule } from './system-users-routing.module';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbToastModule, NgbDropdownModule, NgbNavModule, NgbTypeaheadModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CountUpModule } from 'ngx-countup';
import { NgPipesModule } from 'ngx-pipes';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SimplebarAngularModule } from 'simplebar-angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { DashboardsRoutingModule } from '../dashboards/dashboards-routing.module';
import { NewUserComponent } from './new-user/new-user.component';
import { NewRoleComponent } from './new-role/new-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditAffiliatesComponent } from './edit-affiliates/edit-affiliates.component';
import { NewAffiliateComponent } from './new-affiliate/new-affiliate.component';
import { AffiliatesTableComponent } from './affiliates/affiliates-table/affiliates-table.component';


@NgModule({
  declarations: [
    RolesComponent,
    UsersComponent,
    NewUserComponent,
    NewRoleComponent,
    EditRoleComponent,
    EditUserComponent,
    AffiliatesTableComponent,
    EditAffiliatesComponent,
    NewAffiliateComponent
  ],
  imports: [
    CommonModule,
    SystemUsersRoutingModule,

    NgbToastModule,
    NgbTooltipModule,
    FeatherModule.pick(allIcons),
    CountUpModule,
    NgbDropdownModule,
    NgbNavModule,
    SimplebarAngularModule,
    NgApexchartsModule,   
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
export class SystemUsersModule { }

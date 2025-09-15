import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbTooltipModule, NgbPaginationModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Component


import {NgbdappSortableHeader} from './acounts-list/application-sortable.directive';


// Routing
import { AccountsRoutingModule } from './accounts-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

// Apex Chart Package
import { NgApexchartsModule } from 'ng-apexcharts';

// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';


// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';

// Ng Select
import { NgSelectModule } from '@ng-select/ng-select';
// Load Icon
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { AccountsListComponent } from './acounts-list/accounts-list.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { PendingAccountsComponent } from './pending-accounts/pending-accounts.component';
import { JointAccountsComponent } from './joint-accounts/joint-accounts.component';
import { ChildAccountsComponent } from './child-accounts/child-accounts.component';

@NgModule({
  declarations: [
    AccountsListComponent,
    NgbdappSortableHeader,
    AccountDetailsComponent,
    PendingAccountsComponent,
    JointAccountsComponent,
    ChildAccountsComponent
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
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
export class AccountsModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}

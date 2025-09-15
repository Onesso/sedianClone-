import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTooltipModule, NgbPaginationModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'src/app/shared/shared.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { ProductSetupRoutingModule } from './product-setup-routing.module';
import { AccountTypeComponent } from './account-type/account-type.component';
import { ProductTypeComponent } from './product-type/product-type.component';
import { ParentAccountComponent } from './parent-account/parent-account.component';
import { BundleProductsComponent } from './bundle-products/bundle-products.component';
import { PendingProductTypesComponent } from './pending-product-types/pending-product-types.component';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { ProductMappingComponent } from './product-mapping/product-mapping.component';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};
@NgModule({
  declarations: [
    AccountTypeComponent,
    ProductTypeComponent,
    ParentAccountComponent,
    BundleProductsComponent,
    PendingProductTypesComponent,
    ProductMappingComponent
  ],
  imports: [
    CommonModule,
    ProductSetupRoutingModule,
    CKEditorModule,

    SharedModule,
    NgApexchartsModule,
    NgxDropzoneModule,
    FeatherModule.pick(allIcons),
    NgbDropdownModule,   
    NgbTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    FlatpickrModule,
    NgSelectModule,
    NgbPaginationModule,
    NgbNavModule,
    DropzoneModule     
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ProductSetupModule { }

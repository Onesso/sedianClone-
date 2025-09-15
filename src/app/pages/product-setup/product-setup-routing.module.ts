import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountTypeComponent } from './account-type/account-type.component';
import { BundleProductsComponent } from './bundle-products/bundle-products.component';
import { ParentAccountComponent } from './parent-account/parent-account.component';
import { ProductTypeComponent } from './product-type/product-type.component';
import { PendingProductTypesComponent } from './pending-product-types/pending-product-types.component';
import { ProductMappingComponent } from './product-mapping/product-mapping.component';

const routes: Routes = [  
  {
    path: "account-type",
    component: AccountTypeComponent
  },
  {
    path: "product-type",
    component:ProductTypeComponent
  },
  {
    path: "bundle-products",
    component: BundleProductsComponent
  },
  {
    path: "parent-account",
    component: ParentAccountComponent
  },
  {
    path: "pending-product-types",
    component: PendingProductTypesComponent
  },
  {
    path: "product-mapping/:id",
    component: ProductMappingComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductSetupRoutingModule { }

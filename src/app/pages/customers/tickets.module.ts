import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NgbPaginationModule,
  NgbTypeaheadModule,
  NgbDropdownModule,
  NgbTooltipModule,
  NgbNavModule,
  NgbAccordionModule,
  NgbRatingModule,
} from "@ng-bootstrap/ng-bootstrap";

// Counter
import { CountUpModule } from "ngx-countup";
// Flat Picker
import { FlatpickrModule } from "angularx-flatpickr";
// Simple Bar
import { SimplebarAngularModule } from "simplebar-angular";

// Load Icons
import { defineElement } from "lord-icon-element";
import lottie from "lottie-web";

// Component pages
import { TicketsRoutingModule } from "./tickets-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { ListComponent } from "./list/list.component";

// sorting
import { NgbdListSortableHeader } from "./list/list-sortable.directive";
import { SlickCarouselModule } from "ngx-slick-carousel";
import {
  DROPZONE_CONFIG,
  DropzoneConfigInterface,
  DropzoneModule,
} from "ngx-dropzone-wrapper";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";
import { CustomerDetailsComponent } from "./customer-details/customer-details.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxSliderModule } from "ngx-slider-v2";
import { NgxImageZoomModule } from "ngx-image-zoom";
import { PhotoGalleryModule } from "@twogate/ngx-photo-gallery";
import { ReconcileIdComponent } from "./reconcile-id/reconcile-id.component";

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  url: "https://httpbin.org/post",
  maxFilesize: 50,
  acceptedFiles: "image/*",
};

@NgModule({
  declarations: [
    ListComponent,
    CustomerDetailsComponent,
    NgbdListSortableHeader,
    ReconcileIdComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    NgbTooltipModule,
    CountUpModule,
    FlatpickrModule,
    SimplebarAngularModule,
    TicketsRoutingModule,
    SharedModule,
    NgbNavModule,
    SlickCarouselModule,
    NgxImageZoomModule,
    PhotoGalleryModule,
    NgSelectModule,

    NgbAccordionModule,
    NgbRatingModule,

    NgxSliderModule,

    CKEditorModule,
    DropzoneModule,

    NgSelectModule,

    NgxMaskDirective,
    NgxMaskPipe,
  ],

  providers: [
    provideNgxMask(),
    DatePipe,
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TicketsModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}

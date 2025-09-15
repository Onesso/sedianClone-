import { filter } from "rxjs/operators";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { take } from "rxjs/operators";
// Products Services

import { productModel, productList, ExcepitonInfo } from "../customer.model";
import { SlickCarouselComponent } from "ngx-slick-carousel";
import { CustomersService } from "src/app/core/services/customers.service";
import { ToastrService } from "ngx-toastr";
import { GlobalComponent } from "src/app/global-component";
import { Lightbox } from "ngx-lightbox";
import { Gallery } from "ng-gallery";

const imageUrl = GlobalComponent.IMAGE_URL;

@Component({
  selector: "app-product-detail",
  templateUrl: "./customer-details.component.html",
  styleUrls: ["./customer-details.component.scss"],
})

/**
 * ProductDetail Component
 */
export class CustomerDetailsComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  public productDetail!: productModel[];
  private _album: any[] = [];
  isImage;
  defaultSelect = 2;
  readonly = false;
  content?: any;
  products: any;
  details: any;
  loading: boolean = false;

  // State management properties
  currentPage: number = 1;
  selectedStatus: string = "";
  searchObject: string = "";
  startDate: string = "";
  endDate: string = "";

  exceptionData: ExcepitonInfo[] = [];

  zoomedImage: string = "";
  isModalVisible: boolean = false;
  zoomedImageUrl: string | null = null;

  images = [
    "https://via.placeholder.com/400x300",
    "https://via.placeholder.com/600x400",
    "https://via.placeholder.com/800x600",
  ];

  @ViewChild("slickModal") slickModal!: SlickCarouselComponent;

  constructor(
    private customer: CustomersService,
    private toastr: ToastrService,
    private lightbox: Lightbox,
    public gallery: Gallery,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.products = this.route.snapshot.params;
    this.route.params.subscribe(
      (params) =>
        (this.productDetail = productList.filter(function (product: any) {
          return product.id == parseInt(params["any"]);
        }))
    );
    this.isImage = this.productDetail[0]?.images[0];
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: "Customer" },
      { label: "Details", active: true },
    ];

    // Get state from query parameters
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      // Set current page from route params
      this.currentPage = params["page"];
      this.selectedStatus = params["status"] || "";
      this.searchObject = params["search"] || "";
      this.startDate = params["startDate"] || "";
      this.endDate = params["endDate"] || "";
    });

    this.fetchDetails();
  }

  /**
   * Swiper setting
   */
  config = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
  };

  slidesConfig = {
    // Configuration options for the ngx-slick-carousel
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
  };

  slickChange(event: any) {
    const swiper = document.querySelectorAll(".swiperlist");
  }

  slidePreview(id: any, event: any) {
    const swiper = document.querySelectorAll(".swiperlist");
    swiper.forEach((el: any) => {
      el.classList.remove("swiper-slide-thumb-active");
    });
    event.target
      .closest(".swiperlist")
      .classList.add("swiper-slide-thumb-active");
    this.slickModal.slickGoTo(id);
  }

  zoomImage(imageUrl: string) {
    this.zoomedImageUrl = imageUrl;
  }

  closeZoomed() {
    this.zoomedImageUrl = null;
  }

  fetchDetails() {
    this.loading = true;
    this.route.params.subscribe((params) => {
      const id = params["id"]; // (+) converts string 'id' to a number
      this.customer.getCustomerByCustomerNo(id).subscribe(
        (resp: any) => {
          switch (resp.messageCode) {
            case "00":
              this.loading = false;
              document.getElementById("elmLoader")?.classList.add("d-none");
              this.details = resp.data.info;
              let custExceptions = this.details.exceptionInfo;
              this.exceptionData = custExceptions;
              let imagesData = this.details.imagesInfo[0];
              imagesData.frontId =
                imagesData.frontId.length > 0 || imagesData.frontId != null
                  ? imageUrl + imagesData.frontId
                  : null;
              imagesData.signatuerLink =
                imagesData.signatuerLink.length > 0 ||
                imagesData.signatuerLink != null
                  ? imageUrl + imagesData.signatuerLink
                  : null;
              imagesData.iprsImage =
                imagesData.iprsImage.length > 0 && imagesData.iprsImage != null
                  ? imageUrl + imagesData.iprsImage
                  : null;
              imagesData.selfieImage =
                imagesData.selfieImage.length > 0 ||
                imagesData.selfieImage != null
                  ? imageUrl + imagesData.selfieImage
                  : null;
              imagesData.backId =
                imagesData.backId.length > 0 || imagesData.backId != null
                  ? imageUrl + imagesData.backId
                  : null;
              break;
            case "01":
              this.toastr.info(resp.message);
              this.loading = false;
              break;
          }
        },
        (error) => {
          this.loading = false;
          document.getElementById("elmLoader")?.classList.add("d-none");
          this.toastr.error("Error loading customer details");
          console.error("Customer Details Error:", error);
        }
      );
    });
  }

  open(index: number): void {
    // open lightbox
    this.lightbox.open(this._album, index, {});
  }

  close(): void {
    // close lightbox programmatically
    this.lightbox.close();
  }

  // Method to navigate back with state preserved
  navigateBack() {
    // Set the flag to indicate back navigation
    sessionStorage.setItem("navigationFromDetails", "true");

    // Build query parameters with all the filters
    const queryParams: any = {
      page: this.currentPage,
    };

    // Only add non-empty parameters to avoid cluttering the URL
    if (this.selectedStatus) queryParams.status = this.selectedStatus;
    if (this.searchObject) queryParams.search = this.searchObject;
    if (this.startDate) queryParams.startDate = this.startDate;
    if (this.endDate) queryParams.endDate = this.endDate;

    // Remove relativeTo and use absolute path
    this.router.navigate(["/app/customers/list"], {
      queryParams,
      replaceUrl: true,
      skipLocationChange: false,
    });
  }
}

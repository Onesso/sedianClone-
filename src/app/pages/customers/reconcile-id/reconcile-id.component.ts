import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Gallery } from 'ng-gallery';
import { Lightbox } from 'ngx-lightbox';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { ToastrService } from 'ngx-toastr';
import { CustomersService } from 'src/app/core/services/customers.service';
import { productModel, ExcepitonInfo, productList } from '../customer.model';
import { GlobalComponent } from 'src/app/global-component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const imageUrl = GlobalComponent.IMAGE_URL;

@Component({
  selector: 'app-reconcile-id',
  templateUrl: './reconcile-id.component.html',
  styleUrls: ['./reconcile-id.component.scss']
})
export class ReconcileIdComponent {

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

  idForm: FormGroup

  customerId: string = "";

  exceptionData: ExcepitonInfo[] = [];

  zoomedImage: string = '';
  isModalVisible: boolean = false;
  zoomedImageUrl: string | null = null;

  images = [
    'https://via.placeholder.com/400x300',
    'https://via.placeholder.com/600x400',
    'https://via.placeholder.com/800x600',
  ];

  @ViewChild('slickModal') slickModal!: SlickCarouselComponent;

  constructor(
    private customer: CustomersService,
    private toastr: ToastrService,
    private lightbox: Lightbox,
    public gallery: Gallery,
    private route: ActivatedRoute, 
    private modalService: NgbModal, 
    private fb: FormBuilder,
    private router: Router
   ) {
    this.products = this.route.snapshot.params
    this.route.params.subscribe(params =>
      this.productDetail = productList.filter(function (product: any) {
        return product.id == parseInt(params['any'])
      })
    );
    this.isImage = this.productDetail[0]?.images[0];

    this.idForm = this.fb.group({
      initialId: ["",[Validators.required]],
      correctId: ["",[Validators.required]]
    })
  }

  ngOnInit(): void {
    /**
   * BreadCrumb
   */
    this.breadCrumbItems = [
      { label: 'Customer' },
      { label: 'Details', active: true }
    ];

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
  arrows: false
};

slidesConfig = {
  // Configuration options for the ngx-slick-carousel
  infinite: true,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
}

  slickChange(event: any) {
    const swiper = document.querySelectorAll('.swiperlist')
  }

  slidePreview(id: any, event: any) {
    const swiper = document.querySelectorAll('.swiperlist')
    swiper.forEach((el: any) => {
      el.classList.remove('swiper-slide-thumb-active')
    })
    event.target.closest('.swiperlist').classList.add('swiper-slide-thumb-active')
    this.slickModal.slickGoTo(id)
  }



  // zoomImage(image: any) {
  //   this.zoomedImage = image.src;
  //   this.isModalVisible = true;
  // }
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
      this.customerId = id;
      this.customer.getCustomerByCustomerNo(id).subscribe((resp: any) => {
        switch (resp.messageCode) {
          case "00":
            this.loading = false;
            document.getElementById('elmLoader')?.classList.add('d-none')
            this.details = resp.data.info;
            let custExceptions = this.details.exceptionInfo
            this.exceptionData = custExceptions;
            let imagesData = this.details.imagesInfo[0];
            imagesData.frontId = imagesData.frontId.length > 0 || imagesData.frontId != null  ? imageUrl + imagesData.frontId : null;
            imagesData.signatuerLink = imagesData.signatuerLink.length > 0 || imagesData.signatuerLink != null ? imageUrl + imagesData.signatuerLink : null;
            imagesData.iprsImage = imagesData.iprsImage.length > 0 && imagesData.iprsImage != null ? imageUrl + imagesData.iprsImage : null;
            imagesData.selfieImage =imagesData.selfieImage.length > 0  || imagesData.selfieImage != null ? imageUrl + imagesData.selfieImage : null;
            imagesData.backId = imagesData.backId.length > 0 || imagesData.backId != null  ? imageUrl + imagesData.backId : null;

            this.idForm.patchValue({
              initialId: this.details?.personalInfo[0]?.idNo
            })
            break;
          case "01":
            this.toastr.info(resp.message);
            this.loading = false;
            break;
        }
      });
    });
  }


  open(index: number): void {
  
    // open lightbox
    this.lightbox.open(this._album, index, { });
  }

  close(): void {
    // close lightbox programmatically
    this.lightbox.close();
  }

  updateIdNumber(){
    const {initialId, correctId} = this.idForm.value;

    
    const payload = {
      nationalId: initialId,
      customerId: this.customerId,
      newNationalId: correctId,
      email: this.details?.personalInfo[0]?.email ,
      phone: this.details?.personalInfo[0]?.phone,
    }

    const repushPayload = {
      customerId: this.customerId,
      newNationalId: correctId,
      docType: "NATIONAL_ID"
  
    }

    this.loading = true;
    this.customer.updateIdNumber(payload).subscribe({
      next:(res: any) => {
        switch (res.messageCode) {
          case "00":
            
            this.repushApplication(repushPayload);
          break;

          case "01":
            this.loading = false;
            this.toastr.error("An error occurred. Please try again later");
            break;
        default:
          break;
        }
      },
      error:(err)=> {
        this.loading = false;
        this.toastr.error(err);
      }
    })

  }

  repushApplication(payload: any){
    this.loading = true;
    this.customer.repushApplication(payload).subscribe({
      next:(res: any) => {
        switch (res.messageCode) {
          case "00":
            this.loading = false;
            this.toastr.success(res.message);
            setTimeout(()=> {
              this.router.navigate(['app/customers/list']);
            },3000);            
          break;

          case "01":
            this.loading = false;
            this.toastr.error("An error occurred. Please try again later");
            break;
        default:
          break;
        }
      },
      error:(err)=> {
        this.loading = false;
        this.toastr.error(err);
      }
    })
  }

}

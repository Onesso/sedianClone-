import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Sweet Alert
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalComponent } from 'src/app/global-component';
import { ExceptionService } from '../exception.service';
import { ToastrService } from 'ngx-toastr';
import { SettingsService } from '../../settings/settings.service';
import { DecimalPipe } from '@angular/common';
import { Lightbox } from 'ngx-lightbox';
import { PermissionsService } from '../../../core/services/permissions.service';


@Component({
  selector: 'app-kra-detals',
  templateUrl: './kra-detals.component.html',
  styleUrls: ['./kra-detals.component.scss'],
  providers:[DecimalPipe, SettingsService, ExceptionService]
})
export class KraDetalsComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  deleteId: any;
  dataCount: any;
  custName: string = ""; 
  name: string = "";

  loading: boolean = false;
  approvingException: boolean = false;
  rejectingException: boolean = false;
  invitingCustomer: boolean = false;

  details: any[] = [];
 
  exception: any;
  selectedExceptionCodes: any[] = [];
  id: string = "";
  groupCode: string = '';
  rejections: any[] = [];
  imageUrl =  GlobalComponent.IMAGE_URL;
  selfie: string = "";

  images: { src: string; thumb: string; caption: string }[] = [];
  photoImages: { src: string; thumb: string; caption: string }[] = [];

  activationForm: FormGroup;

  level: string = '';



  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private service: ExceptionService,
    private rejectionType: SettingsService,
    private toastr: ToastrService,
    private lightbox: Lightbox,
    private fb: FormBuilder,
    private auth: PermissionsService
    ) {
      this.activationForm = this.fb.group({
        reason: ["", [Validators.required]],
        rejectionType: [""],
        exceptionDesc:[""]
      });

      this.level = sessionStorage.getItem("level") ?? '';
     }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Exception' },
      { label: 'KRA', active: true }
    ];
    
    this.getDetails();
    this.fetchRejectionType();
  }

  getDetails() {
    this.loading = true;
    this.route.params.subscribe((params) => {
      this.id = params["id"]; // (+) converts string 'id' to a number
      this.groupCode = params["code"];
      let exceptionCategory = "KRA";
      this.service
        .findKycByCustomerNo(this.id, exceptionCategory,this.groupCode)
        .subscribe((resp: any) => {
          switch (resp.messageCode) {
            case "00":
              this.loading = false;
              this.details = resp.data.info;
              console.log('IPRS',this.details);
              //this.images = resp.data.images
              this.exception = resp.data.exception;            
              let imagesData = resp.data.images[0];
              this.name = `KRA EXCEPTION FOR ${this.details[0]?.customerName}`;
              imagesData.frontId = this.imageUrl + imagesData?.frontId;
              imagesData.signatuerLink =
                this.imageUrl + imagesData.signatuerLink;
              if(imagesData.iprsImage) imagesData.iprsImage = this.imageUrl + imagesData?.iprsImage;
              imagesData.selfieImage = this.imageUrl + imagesData?.selfieImage;
              imagesData.backId = this.imageUrl + imagesData?.backId;
         

              //Signature Image
              const src = imagesData.signatuerLink;
              const caption = 'Signature'
              const thumb =  imagesData.signatuerLink;
              const item = {
                src: src,
                caption: caption,
                thumb: thumb
              };
              this.photoImages.push(item);

       
              
              //ID front Image
              const FRONTsrc = imagesData.frontId;
              const FRONTcaption = 'Front ID'
              const FRONTthumb =  imagesData.frontId;
              const FRONTitem = {
                src: FRONTsrc ,
                caption: FRONTcaption ,
                thumb: FRONTthumb
              };
              this.photoImages.push(FRONTitem);

              //ID Back Image
              const BACKsrc = imagesData.backId;
              const BACKcaption = 'BACK ID'
              const BACKthumb =  imagesData.backId;
              const BACKitem = {
                src: BACKsrc,
                caption: BACKcaption,
                thumb: BACKthumb
              };
              this.photoImages.push(BACKitem);

               //Selfie Image

               const SELsrc = imagesData?.selfieImage ?? '';
               this.selfie = SELsrc;            
               const SELcaption = 'Selfie'
               const SELthumb =  imagesData.selfieImage ?? '';
               const SELitem = {
                 src: SELsrc,
                 caption: SELcaption,
                 thumb: SELthumb
               };
               this.images.push(SELitem);

                      //Iprs Image
              const IprsSrc = resp.data.images[0].iprsImage ?? '';
              const IPRScaption = 'IPRS Image';
              const IPRSthumb =  resp.data.images[0].iprsImage?? '';
              const IPitem = {
                src: IprsSrc,
                caption: IPRScaption,
                thumb: IPRSthumb
              };             
              this.images.push(IPitem);

              break;
            case "01":
              this.toastr.info(resp.message);
              this.loading = false;
              break;
          }
        });
    });
  }

  confirm() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#364574',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes, Reject Exception!'
    }).then(result => {
      if (result.value) {
        this.rejectException();       
      }
    });
  }

  fetchRejectionType() {
    this.rejectionType.listRejectionTypes().subscribe((resp: any) => {
      switch (resp.messageCode) {
        case "00":
          this.loading = false;
          this.rejections = resp.data.info;
          break;
        case "01":
          this.toastr.info(resp.message);
          this.loading = false;
          break;
      }
    });
  }

  selectedException(exception: any, event: any) {
    if (event.target.checked) {
      this.selectedExceptionCodes.push(exception.excepCode);
    } else {
      this.selectedExceptionCodes = this.selectedExceptionCodes.filter(
        (codes) => codes !== exception.excepCode
      );
    }
  }

  open(index: number): void {
    // open lightbox
    this.lightbox.open(this.images, index, { });
  }

  close(): void {
    // close lightbox programmatically
    this.lightbox.close();
  }

    //Takes an Application to the next level for approval
    authorizeForAccountCreation(): void {
      this.approvingException = true;
      const payload = {
        excepCode: this.selectedExceptionCodes.join(","),
        group_code: this.groupCode,
        nationalId: this.details[0].nationalId      
      }
  
      this.service.authorizeForAccountCreation(payload).subscribe((resp: any) => {
        switch (resp.messageCode) {
          case "00":          
            this.approvingException = false;

            this.toastr.success("Application has been pushed to the next level for approval.");
            setTimeout(() => {
              this.router.navigate([`/app/exception/kra/${this.level}`]);
            },2000)        
            break;
          case "01":
            this.toastr.warning(resp.message);          
            this.approvingException = false;
            break;
        }
      });
    }

  approveException() {  
    this.approvingException = true;
    const payload = {
      excepCode: this.selectedExceptionCodes.join(","),
      group_code: this.groupCode,
      allowAccountCreationYN: "Y",
      exceptionAllowedBy: "",
      exceptionAllowedDate: "",
      reason: this.activationForm.value.reason,
      authorizedBy: "",
      authorizedDate: "",
      custNo: this.details[0]?.customerNo,
      exceptionType: "KRA",
      rejectedYN: "N",
    };
  
    this.service.clearException(payload).subscribe((resp: any) => {
      switch (resp.messageCode) {
        case "00":        
          this.approvingException = false;
          this.toastr.success("Exception was successfully approved")
          this.router.navigate([`/app/exception/kra/${this.level}`]);
          break;
        case "01":
          this.toastr.info(resp.message);
          this.loading = false;
          this.approvingException = false;
          break;
      }
    });
  }

  rejectException() {   
    this.rejectingException = true;
    
    const payload = {
      excepCode: this.selectedExceptionCodes.join(","),
      group_code: this.groupCode,
      allowAccountCreationYN: "N",
      exceptionAllowedBy: "",
      exceptionAllowedDate: "",
      reason: this.activationForm.value.reason,
      authorizedBy: "",
      authorizedDate: "",
      custNo: this.details[0]?.customerNo,
      exceptionType: "KRA",
      rejectedYN: "Y",
      rejectionType: this.activationForm.value.rejectionType,
    };

    this.service.clearException(payload).subscribe((resp: any) => {
      switch (resp.messageCode) {
        case "00":
          this.loading = false;
          this.rejectingException = false;
          this.inviteCustomer();
          Swal.fire({title: 'Exception Rejected', text:'Application has been rejected. In addition, the customer has been invited to visit their nearest branch for assistance.', confirmButtonColor: '#364574', icon: 'success',});
          this.router.navigate([`/app/exception/kra/${this.level}`]);
          break;
        case "01":
          this.toastr.error(resp.message);
          this.loading = false;
          this.rejectingException = false;
          break;
      }
    });
  }

  inviteCustomer() {   
    this.invitingCustomer = true;
    const payload = {
      "excepCode": this.exception[0].excepCode,
      "groupNo": this.exception[0].codeGroup,
      "customerNo": this.details[0].customerNo,
      "nationalId": this.details[0].nationalId,
      "description":this.exception[0].excepDescription
    }
    this.service.inviteCustomer(payload).subscribe((resp: any) => {
      switch (resp.messageCode) {
        case '00':
          this.loading = false
          this.invitingCustomer = false;
          // this.toastr.success("Invitation sent successfully")
          // this.router.navigate([`/app/exception/kra/${this.level}`]);
          break;
        case '01':
          this.toastr.info(resp.message)
          this.loading = false;
          this.invitingCustomer = false;
          break;
      }

    })

  }

  canPerformAction(): boolean {
    return this.auth.isPermissionAllowed('DashboardMenu','Write');
  }
}

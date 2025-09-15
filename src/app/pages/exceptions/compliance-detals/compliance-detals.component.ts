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
  selector: 'app-compliance-detals',
  templateUrl: './compliance-detals.component.html',
  styleUrls: ['./compliance-detals.component.scss'],
  providers:[DecimalPipe, SettingsService, ExceptionService]
})
export class ComplianceDetalsComponent {
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
 
  level: string = "";
  exception: any;
  selectedExceptionCodes: any[] = [];
  id: string = "";
  groupCode: string = '';
  rejections: any[] = [];
  imageUrl =  GlobalComponent.IMAGE_URL;
  selfie: string = "";

  images: any;
  photoImages: { src: string; thumb: string; caption: string }[] = [];

  activationForm: FormGroup;



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
      { label: 'Compliance', active: true }
    ];
    
    this.getDetails();
    this.fetchRejectionType();
  }

  getDetails() {
    this.loading = true;
    this.route.params.subscribe((params) => {
      this.id = params["id"]; // (+) converts string 'id' to a number
      this.groupCode = params["code"];
      let exceptionCategory = "CRR";
      this.service
        .findKycByCustomerNo(this.id, exceptionCategory,this.groupCode)
        .subscribe((resp: any) => {
          switch (resp.messageCode) {
            case "00":
              this.loading = false;
              this.details = resp.data.info;           
              // this.images = resp.data.images
              this.exception = resp.data.exception;            
              let imagesData = resp.data.images[0];            
              this.name = `COMPLIANCE EXCEPTION FOR ${this.details[0]?.customerName}`;
              imagesData.frontId = this.imageUrl + imagesData?.frontId;
              imagesData.signatuerLink =
                this.imageUrl + imagesData.signatuerLink;               

              if(imagesData.iprsImage === ''){
                imagesData.iprsImage = "";              
              }
              else{
                imagesData.iprsImage = this.imageUrl + imagesData?.iprsImage;
              }
              

             
              imagesData.selfieImage = this.imageUrl + imagesData?.selfieImage;
              imagesData.backId = this.imageUrl + imagesData?.backId;              
              this.images = [imagesData];              
         
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
      confirmButtonText: 'Yes, Reject Application!'
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
            this.router.navigate([`/app/exception/compliance/${this.level}`]);
          },2000)
          break;
        case "01":
          this.toastr.info(resp.message);          
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
      exceptionType: "CRR",
      rejectedYN: "N",
    };
  
    this.service.clearException(payload).subscribe((resp: any) => {
      switch (resp.messageCode) {
        case "00":   
          this.approvingException = false;
          this.toastr.success("Exception was successfully approved")
          this.router.navigate([`/app/exception/compliance/${this.level}`]);
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
      exceptionType: "CRR",
      rejectedYN: "Y",
      rejectionType: this.activationForm.value.rejectionType,
    };

    this.service.clearException(payload).subscribe((resp: any) => {
      switch (resp.messageCode) {
        case "00":        
          this.rejectingException = false;
          this.inviteCustomer();
          this.toastr.success('Customer has been notified to visit their nearest Sidian branch for assistance.','',{timeOut: 3000});
          setTimeout(() => {
            this.router.navigate([`/app/exception/compliance/${this.level}`]);
          }, 3000);  
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
          // this.router.navigate([`/app/exception/compliance/${this.level}`]);
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

import { DecimalPipe } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbdappSortableHeader, appSortEvent } from '../../accounts/acounts-list/application-sortable.directive';
import { ApplicationModel } from '../../accounts/acounts-list/accounts-list.model';
import { AccountsListService } from '../../accounts/accounts-list.service';
import { ProductSetupService } from '../product-setup.service';
// Ck Editer
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { Router } from '@angular/router';



@Component({
  selector: 'app-product-type',
  templateUrl: './product-type.component.html',
  styleUrls: ['./product-type.component.scss'],
  providers: [AccountsListService,ProductSetupService, DecimalPipe]
})
export class ProductTypeComponent implements OnInit {
// bread crumb items
breadCrumbItems!: Array<{}>;
applications: any;
masterSelected!: boolean;
@ViewChildren(NgbdappSortableHeader) headers!: QueryList<NgbdappSortableHeader>;
// Form
applicationData!: FormGroup;
editForm: FormGroup;
mappingForm: FormGroup;
submitted = false;
public Editor = ClassicEditor;

loading = false;
rows: any[] = [];
incomeRange: any[] = [];
bundleCode: any[]= [];



currentPage: any = 1;
pageSize: any = 10;
startIndex: number = 0;
endIndex: number = 10;
totalRecords: number = 0;

paginationDatas: any;
attributedata: any;
existingData: any;
fuzzyData: any;

existingTerm: any;
fuzzyTerm: any;
dataterm: any;
term: any;

approved: any[] = [];
accountTypes: any[] = [];
parentAccounts:any[] = [];

fileToUpload!: File;
public type: string = 'component';
public disabled: boolean = false;
editId: string= '';
mapId: string= '';

public config: DropzoneConfigInterface = {
  clickable: true,
  maxFiles: 2,
  autoReset: null,
  errorReset: null,
  cancelReset: null,
  maxFilesize:10
};

@ViewChild("policyImage") policyImage!: ElementRef;

// Table data
Applicationlist!: Observable<ApplicationModel[]>;
total: number = 0;
files: File[] = [];
constructor(
  public service: AccountsListService,
  public formBuilder: FormBuilder,
  private toastr: ToastrService,
  private router: Router,
  private productService: ProductSetupService,
  public modalService: NgbModal) {


  this.editForm = this.formBuilder.group({
    accountType: ["", [Validators.required]],
    category: ["", [Validators.required]],
    bundleCode: [""],
    name: ["", [Validators.required]],
    score: ["", [Validators.required]],
    multipleAccountYN: ["", Validators.required],
    policyTitle: ["", [Validators.required]],
    policyDescription: ["", [Validators.required]],
    monthlyFee: ["", [Validators.required]],
    openningBalance: ["", [Validators.required]],
    benefits: ["", [Validators.required]],
    targetMarket: ["", [Validators.required]],
    features: ["", [Validators.required]],
    onboardingType: ["", [Validators.required]],
    initialBalance: [""],
    savingYn: ["", [Validators.required]],
  });

  
   this.applicationData = this.formBuilder.group({
    accountType: ["", [Validators.required]],
    category: ["", [Validators.required]],
    bundleCode: [""],
    name: ["", [Validators.required]],
    score: ["", [Validators.required]],
    multipleAccountYN: ["", Validators.required],
    policyTitle: ["", [Validators.required]],
    policyDescription: ["", [Validators.required]],
    monthlyFee: ["", [Validators.required]],
    openningBalance: ["", [Validators.required]],
    benefits: ["", [Validators.required]],
    targetMarket: ["", [Validators.required]],
    features: ["", [Validators.required]],
    onboardingType: ["", [Validators.required]],
    initialBalance: [""],
    savingYn: ["", [Validators.required]],
  });

  this.mappingForm = this.formBuilder.group({
    accountType: ["", [Validators.required]],
    bundle: ["", [Validators.required]],
    income: ["", [Validators.required]],
  });


}


ngOnInit(): void {

  this.breadCrumbItems = [
    { label: 'Product Setup' },
    { label: 'Account Type', active: true }
  ];

 this.fetchAccountSetup();
 this.fetchAccountTypes();
 this.fetchParentAccounts();
 this.fetchIncomes();
 this.fetchBundleCode();

 
}

onSelect(event: any) {
  if(event.addedFiles[0].size > 2097152){
    this.toastr.info("File is too big!  Please upload a file less than 2mb.");
  }
  else{
    this.files.push(...event.addedFiles);
    this.fileToUpload = event.addedFiles[0];
  }
}

onRemove(event: any) {  
  this.files.splice(this.files.indexOf(event), 1);
}

onPageChange(event: any) {
  this.currentPage = event;
  this.fetchAccountSetup();   
}

viewMapping(id: string){
this.router.navigate(['app/product-setup/product-mapping',id]);
}


public onUploadInit(args: any): void {
  console.log('onUploadInit:', args);
}

public onUploadError(args: any): void {
  console.log('onUploadError:', args);
}

public onUploadSuccess(args: any): void {  
  this.fileToUpload=args[0];
}

handleFileInput(event: Event) {
 
  if (this.policyImage.nativeElement.files[0].size > 2097152) {
    this.toastr.info("File is too big!  Please upload a file less than 2mb.");
    this.policyImage.nativeElement.value = "";
  } else {
    this.fileToUpload = this.policyImage.nativeElement.files.item(0);
  }
}

fetchAccountTypes() {
  this.loading = true;
  this.productService.listAllAccountTypes().subscribe((resp: any) => {
    this.loading = false;
    this.accountTypes = resp.data.object;
  });
}

fetchParentAccounts() {
  this.productService.fetchParentAccounts().subscribe((resp: any) => {
    this.loading = false;
    this.parentAccounts = resp.data.info;
  });
}


// Check Box Checked Value Get
checkedValGet: any[] = [];
// The master checkbox will check/ uncheck all items


// Open add Model
openModel(content: any) {
  this.modalService.open(content, { size: 'xl', centered: true });
}

openMappingModal(content: any,data:any) {
  this.modalService.open(content, { size: 'lg', centered: true });
  this.mapId= data.id
}

openEditModal(editcontent: any,data:any) {
  console.log('DATA',data.onboardingType,);
  this.modalService.open(editcontent, { size: 'xl', centered: true });
  this.editId = data.id
  this.editForm.patchValue({
    accountType: data.accountType,
    bundleCode: data.bundleCode,
    category: data.category,
    name: data.name,
    score: data.score,
    multipleAccountYN: data.multipleAccountYn,
    policyTitle: data.policyTitle,
    policyDescription: data.policyDecription,
    monthlyFee: data.monthlyFee,
    openningBalance: data.openningBalance,
    benefits: data.benefits,
    targetMarket: data.targetMarket,
    features: data.features,
    onboardingType: data.onboardingType,
    initialBalance: data.initialBalance,
 
    savingYn: data.savingYn,
    policyImageName: data.policyImageName,
  })
}

// File Upload
imageURL: string | undefined;
fileChange(event: any) {
  let fileList: any = (event.target as HTMLInputElement);
  let file: File = fileList.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    this.imageURL = reader.result as string;
    document.querySelectorAll('#companylogo-img').forEach((element: any) => {
      element.src = this.imageURL;
    });
  }
  reader.readAsDataURL(file)
}



/**
* Returns form
*/
get form() {
  return this.applicationData.controls;
}

createProductType() {
  this.loading = true;
  let formData = new FormData();
    formData.append("accountType", this.applicationData.value.accountType);
    formData.append("bundleCode", this.applicationData.value.bundleCode);
    formData.append("category", this.applicationData.value.category);
    formData.append("name", this.applicationData.value.name);
    formData.append("score", this.applicationData.value.score);
    formData.append(
      "multipleAccountYN",
      this.applicationData.value.multipleAccountYN
    );
    formData.append("policyTitle", this.applicationData.value.policyTitle);
    formData.append(
      "policyDecription",
      this.applicationData.value.policyDescription
    );
    formData.append("monthlyFee", this.applicationData.value.monthlyFee);
    formData.append("openningBalance", this.applicationData.value.openningBalance);
    formData.append("score", this.applicationData.value.score);
    formData.append("benefits", this.applicationData.value.benefits);
    formData.append("targetMarket", this.applicationData.value.targetMarket);
    formData.append("features", this.applicationData.value.features);
    formData.append("onboardingType", this.applicationData.value.onboardingType);
    formData.append("intialBalance", this.applicationData.value.openningBalance);
    formData.append("section1", '');
    formData.append("section2", '');
    formData.append("section3", '');
    formData.append("policyImage", this.fileToUpload);
    formData.append("savingYn", this.applicationData.value.savingYn);

  
    this.productService.createAccountSetup(formData).subscribe({
      next:(resp: any) => {
      switch (resp.messageCode) {
        case "00":
          this.loading = false;
          this.modalService.dismissAll();
          this.toastr.success(resp.message);
          this.fetchAccountSetup();          
          break;
        case "01":
          this.loading = false;         
          this.toastr.error(resp.message);
          this.fetchAccountSetup();          
          break;
        default:
          break;
      }
    },
    error:(err)=>{
      this.loading = false;         
      this.toastr.error(err);
    }
  });

}

updateProductType(){
  this.loading = true;
  let formData = new FormData();
  formData.append("accountType", this.editForm.value.accountType);
  formData.append("bundleCode", this.editForm.value.bundleCode);
  formData.append("category", this.editForm.value.category);
  formData.append("name", this.editForm.value.name);
  formData.append("score", this.editForm.value.score);
  formData.append(
    "multipleAccountYN",
    this.editForm.value.multipleAccountYN
  );
  formData.append("policyTitle", this.editForm.value.policyTitle);
  formData.append(
    "policyDecription",
    this.editForm.value.policyDescription
  );
  formData.append("monthlyFee", this.editForm.value.monthlyFee);
  formData.append("openningBalance", this.editForm.value.openningBalance);
  formData.append("benefits", this.editForm.value.benefits);
  formData.append("targetMarket", this.editForm.value.targetMarket);
  formData.append("features", this.editForm.value.features);
  formData.append("onboardingType", this.editForm.value.onboardingType);
  formData.append("intialBalance", this.editForm.value.openningBalance);
  formData.append("section1", this.editForm.value.section1);
  formData.append("section2", this.editForm.value.section2);
  formData.append("section3", this.editForm.value.section3);
  formData.append("policyImage", this.fileToUpload);
  formData.append("savingYn", this.editForm.value.savingYn);
  formData.append("id", this.editId);

  this.productService.updateAccountSetup(formData).subscribe(
    {
      next:(resp: any) => {
        switch (resp.messageCode) {
          case "00":
            this.loading = false;
            this.modalService.dismissAll();
            this.toastr.success(resp.message);
            this.fetchAccountSetup();          
            break;
          case "01":
            this.loading = false;         
            this.toastr.error(resp.message);
            this.fetchAccountSetup();          
            break;
          default:
            break;
        }
      },
      error:(err: any)=>{
        this.loading = false;         
        this.toastr.error(err);
      }
    }
  );
}

/**
 * Delete Model Open
 */
deleteId: any;
confirm(content: any, id: any) {
  this.deleteId = id;
  this.modalService.open(content, { centered: true });
}

// Delete Data
deleteData(id: any) {
  this.loading = true;
  this.productService.deleteAccountSetup(this.deleteId).subscribe((response: any) => {
    switch (response.messageCode) {
      case '00':
        this.modalService.dismissAll('close click')
        let timerInterval: any;
        Swal.fire({
          title: 'Deleted!',
          text: 'Your data has been deleted.',
          icon: 'success',
          confirmButtonColor: '#299cdb',
          timer: 2000,
          timerProgressBar: true,
          willClose: () => {
            clearInterval(timerInterval);
          },
        });      
        break;

        case '01':
        this.toastr.error(response.message);     
        break;
      
        default:
          break;
    }

  })

}

fetchAccountSetup() {
  this.productService.fetchAccountSetupList().subscribe((resp: any) => {
    document.getElementById('elmLoader')?.classList.add('d-none')
    this.loading = false
    this.rows = resp.data.info
    let approv = 'Y'
    this.approved =this.rows.filter(pend => pend.approved === approv)
    this.totalRecords = parseInt(resp.recordCount);        

    this.totalRecords = this.approved.length
  
    this.startIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endIndex = (this.currentPage - 1) * this.pageSize + this.pageSize;


  })
}

fetchIncomes() {
  this.productService.getIncomeRanges().subscribe((resp: any) => {
    this.incomeRange = resp.data.info;
  });
}

fetchBundleCode() {
  this.productService.getBundleProducts().subscribe((resp: any) => {
    this.bundleCode = resp.data.info;
  });
}

saveMapping() {
  this.loading = true;
  const payload = {
    accountType: this.mappingForm.value.accountType,
    accountCode: this.mapId,
    // "bundleCodes": this.selectedBundles,
    incomeRange: this.mappingForm.value.income,
    bundleCode: this.mappingForm.value.bundle,
  };
  this.productService.createMapping(payload).subscribe(
    {
      next:(resp: any) => {
        switch (resp.messageCode) {
          case "00":
            this.loading = false;
            this.modalService.dismissAll();
            this.toastr.success(resp.message);
            this.fetchAccountSetup();          
            break;
          case "01":
            this.loading = false;         
            this.toastr.error(resp.message);
            this.fetchAccountSetup();          
            break;
          default:
            break;
        }
      },
      error:(err: any)=>{
        this.loading = false;         
        this.toastr.error(err);
      }
    }
  );
}
}

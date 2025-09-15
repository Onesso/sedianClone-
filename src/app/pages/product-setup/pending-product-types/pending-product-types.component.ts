import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbdappSortableHeader } from '../../accounts/acounts-list/application-sortable.directive';
import { ApplicationModel } from '../../accounts/acounts-list/accounts-list.model';
import { AccountsListService} from '../../accounts/accounts-list.service';
import { ProductSetupService } from '../product-setup.service';
import { DecimalPipe } from '@angular/common';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { GlobalComponent } from 'src/app/global-component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pending-product-types',
  templateUrl: './pending-product-types.component.html',
  styleUrls: ['./pending-product-types.component.scss'],
  providers: [AccountsListService,ProductSetupService, DecimalPipe]
})
export class PendingProductTypesComponent {
// bread crumb items
breadCrumbItems!: Array<{}>;
applications: any;
masterSelected!: boolean;
@ViewChildren(NgbdappSortableHeader) headers!: QueryList<NgbdappSortableHeader>;
// Form
applicationData!: FormGroup;
submitted = false;

loading = false;
rows: any[] = [];
pending: any[] =[];
editForm: FormGroup;
currentPage: any = 1;
pageSize: any = 10;
startIndex: number = 0;
endIndex: number = 10;
totalRecords: number = 0;
public Editor = ClassicEditor;

paginationDatas: any;
attributedata: any;
existingData: any;
fuzzyData: any;

existingTerm: any;
fuzzyTerm: any;
dataterm: any;
term: any;
prevImage: any;
approveId: string = '';
imgUrl = GlobalComponent.IMAGE_URL;

approved: any[] = [];
accountTypes: any[] = [];
parentAccounts:any[] = [];

// Table data
Applicationlist!: Observable<ApplicationModel[]>;
total: number = 0;
constructor(
  public service: AccountsListService,
  public formBuilder: FormBuilder,
  private toastr: ToastrService,
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
}


ngOnInit(): void {

  this.breadCrumbItems = [
    { label: 'Product Setup' },
    { label: 'Account Type', active: true }
  ];

 this.fetchAccountSetup();
 this.fetchParentAccounts();
 this.fetchAccountTypes();

  // Validation
  this.applicationData = this.formBuilder.group({
    id: [''],
    name: ['', [Validators.required]],
    date: ['', [Validators.required]],
    type: ['', [Validators.required]],
    designation: ['', [Validators.required]],
    contacts: ['', [Validators.required]],
    status: ['', [Validators.required]]
  });

}

onPageChange(event: any) {
  this.currentPage = event;
  this.fetchAccountSetup();   
}


// Open add Model
openModel(content: any) {
  this.modalService.open(content, { size: 'md', centered: true });
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


/**
 * Delete Model Open
 */
deleteId: any;
confirm(content: any, id: any) {
  this.deleteId = id;
  this.modalService.open(content, { centered: true });
}

approvalModal(content: any, data: any) {
  this.approveId = data.id;
  this.modalService.open(content, {size: 'xl',  centered: true });
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
  this.prevImage = this.imgUrl + data.policyImageName;
}

// Delete Data
deleteSetup() {
  this.loading = true
  this.productService.deleteAccountSetup(this.deleteId).subscribe((resp: any) => {
    this.modalService.dismissAll();
    this.toastr.success(resp.message);
    this.fetchAccountSetup()
  })
}

approveProductType(){
  this.loading = true;
    this.productService.approveAccountSetup(this.approveId,"Y").subscribe({
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
  });
}

fetchAccountSetup() {
  this.productService.fetchAccountSetupList().subscribe((resp: any) => {
    document.getElementById('elmLoader')?.classList.add('d-none')
    this.loading = false
    this.rows = resp.data.info
    let approv = 'N'
    this.pending =this.rows.filter(pend => pend.approved === approv)
    this.totalRecords = this.pending.length;  
    this.startIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endIndex = (this.currentPage - 1) * this.pageSize + this.pageSize;   

  })
}


fetchParentAccounts() {
  this.productService.fetchParentAccounts().subscribe((resp: any) => {
    this.loading = false;
    this.parentAccounts = resp.data.info;
  });
}

fetchAccountTypes() {
  this.loading = true;
  this.productService.listAccountTypes().subscribe((resp: any) => {
    this.loading = false;
    this.accountTypes = resp.data.object;
  });
}


}

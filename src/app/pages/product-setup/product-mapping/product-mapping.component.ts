import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ApplicationModel } from '../../accounts/acounts-list/accounts-list.model';
import { AccountsListService } from '../../accounts/accounts-list.service';
import { NgbdappSortableHeader } from '../../accounts/acounts-list/application-sortable.directive';
import { ProductSetupService } from '../product-setup.service';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-mapping',
  templateUrl: './product-mapping.component.html',
  styleUrls: ['./product-mapping.component.scss'],
  providers: [AccountsListService,ProductSetupService, DecimalPipe]
})
export class ProductMappingComponent {
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

// Table data
Applicationlist!: Observable<ApplicationModel[]>;
total: number = 0;
constructor(
  public service: AccountsListService,
  public formBuilder: FormBuilder,
  private router: Router,
  private route: ActivatedRoute,
  private toastr: ToastrService,
  private productService: ProductSetupService,
  public modalService: NgbModal) {

}


ngOnInit(): void {

  this.breadCrumbItems = [
    { label: 'Product Type' },
    { label: 'Product Mapping', active: true }
  ];

 this.fetchProductMapping();

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

back(){
 this.router.navigate(['app/product-setup/product-type'])
}

onPageChange(event: any) {
  this.currentPage = event;
  this.fetchProductMapping();   
}




// Check Box Checked Value Get
checkedValGet: any[] = [];
// The master checkbox will check/ uncheck all items


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


deleteId: any;
confirm(content: any, id: any) {
  this.deleteId = id;
  this.modalService.open(content, { centered: true });
}

// Delete Data
deleteData(id: any) {  
  this.productService.deleteMapping(this.deleteId).subscribe((resp: any) => {
    this.toastr.success(resp.message);
    this.modalService.dismissAll();
    this.fetchProductMapping();
  })
}

fetchProductMapping() {
  this.route.params.subscribe(params => {
    let id = params['id'];
    this.productService.fetchMapping(id).subscribe((resp: any) => {
      document.getElementById('elmLoader')?.classList.add('d-none')
      this.loading = false
      this.rows = resp.data.info 
      this.totalRecords = this.rows.length
  
      this.startIndex = (this.currentPage - 1) * this.pageSize + 1;
      this.endIndex = (this.currentPage - 1) * this.pageSize + this.pageSize;   
  
    })
  })
}
}

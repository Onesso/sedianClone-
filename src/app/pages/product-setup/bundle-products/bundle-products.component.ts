import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbdappSortableHeader, appSortEvent } from '../../accounts/acounts-list/application-sortable.directive';
import { ApplicationModel } from '../../accounts/acounts-list/accounts-list.model';
import { AccountsListService } from '../../accounts/accounts-list.service';
import { DecimalPipe } from '@angular/common';
import { ProductSetupService } from '../product-setup.service';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-bundle-products',
  templateUrl: './bundle-products.component.html',
  styleUrls: ['./bundle-products.component.scss'],
  providers: [AccountsListService,ProductSetupService, DecimalPipe]
})
export class BundleProductsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  applications: any;
  masterSelected!: boolean;
  @ViewChildren(NgbdappSortableHeader) headers!: QueryList<NgbdappSortableHeader>;
  // Form
  createForm!: FormGroup;
  updateForm!: FormGroup;
  submitted = false;

  loading = false;
  rows: any[] = [];

  currentPage: any = 1;
  pageSize: any = 20;
  startIndex: number = 0;
  endIndex: number = 20;
  totalRecords: number = 0;
  fileToUpload!: File;
  factSheetFile!: File;

  paginationDatas: any;
  attributedata: any;
  existingData: any;
  fuzzyData: any;

  existingTerm: any;
  fuzzyTerm: any;
  dataterm: any;
  term: any;
  editId: string = '';
  deleteId: string = '';

  // Table data
  Applicationlist!: Observable<ApplicationModel[]>;
  total: number = 0;

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 2,
    autoReset: null,
    errorReset: null,
    cancelReset: null,
    maxFilesize:10
  };
  
  sheetFiles: File[] = [];
  letterFiles: File[] = [];
  constructor(
    public service: AccountsListService,
    private toastr: ToastrService,
    public formBuilder: FormBuilder,
    private productService: ProductSetupService,
    public modalService: NgbModal) {

  }


  ngOnInit(): void {

    this.breadCrumbItems = [
      { label: 'Product Setup' },
      { label: 'Products Bundle', active: true }
    ];

    this.getProducts();

    // Validation
    this.createForm = this.formBuilder.group({
      code: ["", Validators.required],
      name: ["", Validators.required],
      fact_sheet_name:["",Validators.required],
      letter_name:["",Validators.required],
      description: ["", Validators.required],
      short_description: ["", Validators.required],
      merits: ["", Validators.required]
    });

      
    this.updateForm = this.formBuilder.group({
      code: ["", Validators.required],
      name: ["", Validators.required],
      fact_sheet_name:["",Validators.required],
      letter_name:["",Validators.required],
      description: ["", Validators.required],
      short_description: ["", Validators.required],
      merits: ["", Validators.required]
    })
  }

  public onUploadInit(args: any): void {
    // console.log('onUploadInit:', args);
  }
  
  public onUploadError(args: any): void {
   this.toastr.error(args)
  }
  public onUploadSheetError(args: any): void {
    this.toastr.error(args)
   }
  
  public onUploadSuccess(args: any): void {  
    this.fileToUpload=args[0];
  }

  public onUploadSheetSuccess(args: any): void {  
    this.factSheetFile=args[0];
  }

  onSheetSelect(event: any) {
    if(event.addedFiles[0].size > 2097152){
      this.toastr.info("File is too big!  Please upload a file less than 2mb.");
    }
    else{
      this.sheetFiles.push(...event.addedFiles);
      this.factSheetFile = event.addedFiles[0];
    }
  }
  
  onSheetRemove(event: any) {  
    this.sheetFiles.splice(this.sheetFiles.indexOf(event), 1);
  }

  onLetterSelect(event: any) {
    if(event.addedFiles[0].size > 2097152){
      this.toastr.info("File is too big!  Please upload a file less than 2mb.");
    }
    else{
      this.letterFiles.push(...event.addedFiles);
      this.fileToUpload = event.addedFiles[0];
    }
  }
  
  onLetterRemove(event: any) {  
    this.sheetFiles.splice(this.sheetFiles.indexOf(event), 1);
  }

  onPageChange(event: any) {
    this.currentPage = event;
    this.getProducts();  
  }

  // Open add Model
  openModal(content: any) {
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  openEditModal(content: any, data:any) {
    this.modalService.open(content, { size: 'lg', centered: true });
    this.editId = data.bpdId
    this.updateForm.patchValue({
      code: data.code,
      name: data.name,
      fact_sheet_name:data.fact_sheet_name,
      letter_name:data.letter_name,
      description: data.description,
      short_description: data.short_description,
      merits: data.merits
    })
  }

 


  /**
* Returns form
*/
  get form() {
    return this.createForm.controls;
  }

  


  confirm(content: any, id: any) {    
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData() {
    this.loading = true;
    this.productService
      .deleteBundleProducts(this.deleteId)
      .subscribe((resp: any) => {
        this.loading = false;
        this.modalService.dismissAll();
        this.toastr.success(resp.message);
        this.getProducts();

      });
  }

    getProducts() {
      this.loading = true
      this.productService.getBundleProducts().subscribe( 
        {next: (resp: any) =>{
        this.loading = false
        this.rows = resp.data.info;
        this.totalRecords = this.rows.length;  
        this.startIndex = (this.currentPage - 1) * this.pageSize + 1;
        this.endIndex = (this.currentPage - 1) * this.pageSize + this.pageSize; 
        document.getElementById('elmLoader')?.classList.add('d-none')
      },
      error:(err: any) =>{
        document.getElementById('elmLoader')?.classList.add('d-none')
      }
      },     

      );
    }

   

    createProduct(){
      this.loading = true;
      let formData = new FormData()
      formData.append("code", this.createForm.value.code);
      formData.append("name", this.createForm.value.name);
      formData.append("fact_sheet_name", this.createForm.value.fact_sheet_name);
      formData.append("fact_sheet", this.factSheetFile);
      formData.append("letter_name", this.createForm.value.letter_name);
      formData.append("letter", this.fileToUpload);
      formData.append("description", this.createForm.value.description);
      formData.append("short_description", this.createForm.value.short_description);
      formData.append("merits", this.createForm.value.merits);
  
      this.productService.saveBundleProducts(formData).subscribe(
        (resp:any)=>{
          this.loading = false;
          switch(resp.messageCode) {
            case '00':
              this.toastr.success(resp.message);              
              this.modalService.dismissAll();
              this.getProducts();
              break;
            default:
              this.toastr.warning(resp.message);
              break;
          }
        },
        (err: any) => {
          this.loading = false;
          this.toastr.error(err);  
        }
      )  
    }


    updateProduct(){
      this.loading = true;
      let formData = new FormData()
      formData.append("code", this.updateForm.value.code);
      formData.append("name", this.updateForm.value.name);
      formData.append("fact_sheet_name", this.updateForm.value.fact_sheet_name);
      formData.append("fact_sheet", this.factSheetFile);
      formData.append("letter_name", this.updateForm.value.letter_name);
      formData.append("letter", this.fileToUpload);
      formData.append("description", this.updateForm.value.description);
      formData.append("short_description", this.updateForm.value.short_description);
      formData.append("merits", this.updateForm.value.merits);
  
      this.productService.updateBundleProducts(formData,this.editId).subscribe(
        {
          next: (resp:any)=>{
            this.loading = false;
            switch(resp.messageCode) {
              case '00':
                this.toastr.success(resp.message);              
                this.modalService.dismissAll();
                this.getProducts();
                break;
              default:
                this.toastr.warning(resp.message);
                break;
            }
          },
          error: (err: any) => {
            this.loading = false;
            this.toastr.error(err);  
          }
        }
      )
  
    }

}

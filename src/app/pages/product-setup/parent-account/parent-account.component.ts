import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbdappSortableHeader, appSortEvent } from '../../accounts/acounts-list/application-sortable.directive';
import { ApplicationModel } from '../../accounts/acounts-list/accounts-list.model';
import { AccountsListService } from '../../accounts/accounts-list.service';
import { DecimalPipe } from '@angular/common';
import { ProductSetupService } from '../product-setup.service';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-parent-account',
  templateUrl: './parent-account.component.html',
  styleUrls: ['./parent-account.component.scss'],
  providers: [AccountsListService,ProductSetupService, DecimalPipe]
})
export class ParentAccountComponent implements OnInit{

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  applications: any;
  masterSelected!: boolean;
  @ViewChildren(NgbdappSortableHeader) headers!: QueryList<NgbdappSortableHeader>;
  // Form
  createForm!: FormGroup;
  editForm: FormGroup;
  submitted = false;
  editId: string ='';
  public Editor = ClassicEditor;

  loading = false;
  rows: any[] = [];

  currentPage: any = 1;
  pageSize: any = 20;
  startIndex: number = 0;
  endIndex: number = 20;
  totalRecords: number = 0;

  fileUploaded: boolean = false;

  paginationDatas: any;
  attributedata: any;
  existingData: any;
  fuzzyData: any;

  existingTerm: any;
  fuzzyTerm: any;
  dataterm: any;
  term: any;
  fileToUpload!: File;

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 2,
    autoReset: null,
    errorReset: null,
    cancelReset: null,
    maxFilesize:10
  };
  
  // Table data
  Applicationlist!: Observable<ApplicationModel[]>;
  total: number = 0;
  constructor(
    public service: AccountsListService,
    public formBuilder: FormBuilder,
    private productService: ProductSetupService,
    private toastr: ToastrService,
    public modalService: NgbModal) {
      this.createForm = this.formBuilder.group({
        enableAccount: ["", [Validators.required]],
        short_desc: ["", [Validators.required]],
        long_desc: ["", [Validators.required]]
      });

      this.editForm = this.formBuilder.group({
        enableAccount: ["", [Validators.required]],
        short_desc: ["", [Validators.required]],
        long_desc: ["", [Validators.required]]
      });

  }


  ngOnInit(): void {

    this.breadCrumbItems = [
      { label: 'Product Setup' },
      { label: 'Parent Account', active: true }
    ];

    this.fetchParentAccounts();   
  }

  onPageChange(event: any) {
    this.currentPage = event;
    this.fetchParentAccounts();   
  }

  public onUploadSuccess(args: any): void {  
    this.fileToUpload=args[0];
    this.fileUploaded = true;
  }

  openModal(content: any) {
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  openEditModal(content: any, data: any) {
    this.editId= data.id;
    this.modalService.open(content, { size: 'lg', centered: true });
    this.editForm.patchValue({
      enableAccount: data.enableYn,
      short_desc: data.shortDescription,
      long_desc: data.longDescription
    })
  }

 
  create(){
    let formData = new FormData();
    this.loading = true
     const formValue = this.createForm.value
    formData.append("imageName", this.fileToUpload);
    formData.append("shortDescription", formValue.short_desc);
    formData.append("longDescription", formValue.long_desc);
    formData.append("enableYn", formValue.enableAccount);
    this.productService.createParentAccount(formData).subscribe(
   {
    next: (resp: any) =>{
      this.loading = false
      this.modalService.dismissAll();
      this.fetchParentAccounts();
      this.toastr.success(resp.message);
    }, 
    error: (err) =>{
      this.loading = false
      this.toastr.error(err);
    }

   })

  }

  update(){
    let formData = new FormData();
    this.loading = true
     const formValue = this.editForm.value
    formData.append("imageName", this.fileToUpload);
    formData.append("shortDescription", formValue.short_desc);
    formData.append("longDescription", formValue.long_desc);
    formData.append("enableYn", formValue.enableAccount);
    const params = {
      shortDescription:formValue.short_desc,
      longDescription: formValue.long_desc,
      enableYn: formValue.enableAccount,
      id: this.editId
      }
    this.productService.editParentAccount(formData,params).subscribe(
   {
    next: (resp: any) =>{
      this.loading = false
      this.modalService.dismissAll();
      this.fetchParentAccounts();
      this.toastr.success(resp.message);
    }, 
    error: (err) =>{
      this.loading = false
      this.toastr.error(err);
    }

   })

  }








  
  /**
* Returns form
*/
  get form() {
    return this.createForm.controls;
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
  deleteData() {
    this.loading = true;
    this.productService.deleteParentAccount(this.deleteId).subscribe((resp: any) => {
      this.modalService.dismissAll()
      this.loading = false;
      this.fetchParentAccounts()
    });
  }

  fetchParentAccounts(){
    this.loading = true
    this.productService.fetchParentAccounts().subscribe((resp: any) => {
      document.getElementById('elmLoader')?.classList.add('d-none')
      this.loading = false
      this.rows = resp.data.info
      this.totalRecords = this.rows.length;  
      this.startIndex = (this.currentPage - 1) * this.pageSize + 1;
      this.endIndex = (this.currentPage - 1) * this.pageSize + this.pageSize; 
    })
  }
}

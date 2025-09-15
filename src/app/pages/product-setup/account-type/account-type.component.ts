
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbdappSortableHeader, appSortEvent } from '../../accounts/acounts-list/application-sortable.directive';
import { ApplicationModel } from '../../accounts/acounts-list/accounts-list.model';
import { AccountsListService} from '../../accounts/accounts-list.service';
import { DecimalPipe } from '@angular/common';
import { ProductSetupService } from '../product-setup.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.scss'],
  providers: [AccountsListService,ProductSetupService, DecimalPipe]
})
export class AccountTypeComponent implements OnInit {


  // bread crumb items
  breadCrumbItems!: Array<{}>;
  applications: any;
  masterSelected!: boolean;
  @ViewChildren(NgbdappSortableHeader) headers!: QueryList<NgbdappSortableHeader>;
  // Form
  applicationData: FormGroup;
  submitted = false;

  loading = false;
  rows: any[] = [];

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
  updating: boolean = false;

  // Table data
  Applicationlist!: Observable<ApplicationModel[]>;
  total: number = 0;
  constructor(
    public service: AccountsListService,
    private toastr: ToastrService,
    public formBuilder: FormBuilder,
    private productService: ProductSetupService,
    public modalService: NgbModal) {

      this.applicationData = this.formBuilder.group({
        accountCode:["",Validators.required],
        accountName:["",Validators.required],
        accountDescription:["",Validators.required],
        multipleAccountsAllowed:["",Validators.required]
      })

  }


  ngOnInit(): void {
    /**
* BreadCrumb
*/
    this.breadCrumbItems = [
      { label: 'Product Setup' },
      { label: 'Account Type', active: true }
    ];
    
    this.fetchAccountTypes();
  }

  onPageChange(event: any) {
    this.currentPage = event;
    this.fetchAccountTypes();   
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


  singleData: any;
  editorder(content: any, data: any) {
    this.singleData =  data;   
    this.submitted = false;
    this.modalService.open(content, { size: ' md', centered: true })
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Edit Account Type';
    var updatebtn = document.getElementById('add-btn') as HTMLAreaElement
    updatebtn.innerHTML = "Update";
    document.querySelectorAll('#companylogo-img').forEach((element: any) => {
      element.src = this.singleData.img;
    });
    this.applicationData.controls['accountName'].setValue(this.singleData.name);
    this.applicationData.controls['accountCode'].setValue(this.singleData.accountCode);
    this.applicationData.controls['accountDescription'].setValue(this.singleData.description);
    this.applicationData.controls['multipleAccountsAllowed'].setValue(this.singleData.multipleAccountsAllowed);
  }

  /**
* Returns form
*/
  get form() {
    return this.applicationData.controls;
  }

  createAccountType(){
    this.loading = true;
    const {accountCode, accountName,accountDescription,multipleAccountsAllowed} = this.applicationData.value;
    const btn_type = document.getElementById('add-btn') as HTMLAreaElement
    const btn_value = btn_type.innerHTML;       
      let formData = new FormData()
      formData.append("accountCode", accountCode);
      formData.append("multipleAccountsAllowed", multipleAccountsAllowed);
      formData.append("name", accountName);
      formData.append("score", '');
      formData.append("description", accountDescription);
      if(btn_value === 'Update'){
        this.updating = true;
        this.modalService.dismissAll();
        this.productService.updateAccountType(formData,this.singleData.id).subscribe({
          next:(resp)=>{
            this.modalService.dismissAll();
            this.updating = false;
            this.toastr.success("Account updated successfully");
            this.fetchAccountTypes();
          },
          error:(err)=>{
            this.updating = false;           
          }           
        })
      }
      else{
        this.productService.createAccountType(formData).subscribe({
          next:(resp)=>{
            this.modalService.dismissAll();
            this.loading = false;
            this.toastr.success("Account type created successfully");
            this.fetchAccountTypes();
          },
          error:(err)=>{
            this.loading = false;           
          }        
        }) 
      }
  }

  createapplication() {
    if (this.applicationData.valid) {
      if (this.applicationData.get('id')?.value) {
        this.service.products = this.applications.map((data: { id: any; }) => data.id === this.applicationData.get('id')?.value ? { ...data, ...this.applicationData.value } : data)

      } else {
        const name = this.applicationData.get('name')?.value;
        const designation = this.applicationData.get('designation')?.value;
        const contacts = this.applicationData.get('contacts')?.value;
        const img = "/assets/images/brands/slack.png";
        const date = '26 Sep, 2022';
        const status = this.applicationData.get('status')?.value;
        const type = this.applicationData.get('type')?.value;
        this.service.products.push({
          id: this.applications.length + 1,
          img,
          name,
          designation,
          date,
          contacts,
          type,
          status
        });
        this.modalService.dismissAll()
      }
    }
    this.modalService.dismissAll();
    setTimeout(() => {
      this.applicationData.reset();
    }, 2000);
    this.submitted = true
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
 
    this.productService.deleteAccountType(this.deleteId).subscribe({
      next: (resp: any) =>{
        switch (resp.messageCode) {
          case "00":
            this.loading = false;
            this.modalService.dismissAll('close click')
            let timerInterval: any;
            this.fetchAccountTypes();
            Swal.fire({
              title: 'Deleted!',
              text: 'Account type has been deleted.',
              icon: 'success',
              confirmButtonColor: '#299cdb',
              timer: 2000,
              timerProgressBar: true,
              willClose: () => {
                clearInterval(timerInterval);
              },
            });            
            break;
          case "01":
            this.toastr.error(resp.message);          
            break;
        
          default:
            break;
        }

      },
      error: (err) =>{
        this.toastr.error(err);  
        this.loading = false; 
      }
    })
    
  }

  fetchAccountTypes() {
    this.productService.listAllAccountTypes().subscribe((resp: any) => {
      this.loading = false
      document.getElementById('elmLoader')?.classList.add('d-none')
      this.rows = resp.data.object
      this.total = resp.data.object?.length;

      // this.attributedata = dataattribute
      // this.existingData = existingList
      // this.fuzzyData = FuzzyList
  
      this.paginationDatas = this.rows;
      this.totalRecords = this.paginationDatas.length
  
      this.startIndex = (this.currentPage - 1) * this.pageSize + 1;
      this.endIndex = (this.currentPage - 1) * this.pageSize + this.pageSize;
      if (this.endIndex > this.totalRecords) {
        this.endIndex = this.totalRecords;
      }
      this.paginationDatas = this.rows.slice(this.startIndex - 1, this.endIndex);
    })
    }
  }


 


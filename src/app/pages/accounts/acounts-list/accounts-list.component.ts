import { AccountsService } from '../../../core/services/accounts.service';
import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FormBuilder, Validators, FormGroup, UntypedFormArray, AbstractControl } from '@angular/forms';


import { ApplicationModel } from './accounts-list.model';

import { NgbdappSortableHeader, appSortEvent } from './application-sortable.directive';

// Sweet Alert
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AccountsListService } from '../accounts-list.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

type DateRange ={
  from: any;
  to: any;
}

@Component({
  selector: 'app-application',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss'],
  providers: [AccountsListService, AccountsService, DecimalPipe]
})
export class AccountsListComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  applications: any;
  masterSelected!: boolean;
  @ViewChildren(NgbdappSortableHeader) headers!: QueryList<NgbdappSortableHeader>;
  // Form
  applicationData!: FormGroup;
  submitted = false;

  rows: any[] = [];
  childAccs: any[] = [];
  pendingAccs: any[] = [];
  jointAccs: any[] = [];

  searchObject: string = ""
  startDate: string = "";
  endDate: string = "";
  searchBy: string = "";

  currentPage: any = 1;
  pageSize: any = 50;
  startIndex: number = 0;
  endIndex: number = 3;
  totalRecords: number = 0;
  searchingById: boolean = false;
  searchingByDate: boolean = false;
  searchingByAccType: boolean = false;
  selectedStartDate: string = "";
  selectedEndDate: string = "";
  selectedDates: DateRange = {
    from: undefined,
    to: undefined
  };




  constructor(
    public service: AccountsListService,
    private accounts: AccountsService,
    private toastr: ToastrService,
    public formBuilder: FormBuilder,
    private router: Router,
    public modalService: NgbModal) { 
  }

  loading: boolean = false;

  page = {
    size: 0,
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0
  }


  ngOnInit(): void {
    /**
* BreadCrumb
*/
    this.breadCrumbItems = [
      { label: 'Accounts' },
      { label: 'Individual', active: true }
    ];

    this.page.pageNumber = 0;
    this.page.size = 100;
    this.getAccounts()

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


  // Open add Model
  openModel(content: any) {
    this.modalService.open(content, { size: 'md', centered: true });
  }

  onDateSelect(){   
    setTimeout(() => {
      this.startDate = this.formatDate(this.selectedDates.from);
      this.endDate = this.formatDate(this.selectedDates.to);
    },500);  
  }

  formatDate(date: any) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();
    let today = yyyy + '-' + mm + '-' + dd
    return today
  }

  onStartDateSelect(){       
    setTimeout(() => {
      this.startDate = this.formatDate(this.selectedStartDate);    
    },100); 
}

onEndDateSelect(){       
  setTimeout(() => {    
    this.endDate = this.formatDate(this.selectedEndDate); 
  },100); 
}

  getAccounts() {    
    this.loading = true;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    document.getElementById('elmLoader')?.classList.remove('d-none');
    const endIndex = startIndex + this.pageSize;
    this.accounts.getLocalAccounts(startIndex.toString(), endIndex.toString(), "SINGLE",this.searchBy, this.searchObject,this.startDate,this.endDate).subscribe((resp: any) => {
      switch (resp.messageCode) {
        case '00':
          document.getElementById('elmLoader')?.classList.add('d-none');
          this.getChildAccounts({ offset: 0 });
          this.getJointAccounts({ offset: 0 })
          this.getPendingAccounts({ offset: 0 });
          this.loading = false;
          this.rows = resp.data.info;
          this.totalRecords = parseInt(resp.recordCount);      
          this.startIndex = startIndex + 1;
          this.endIndex = Math.min(endIndex, this.totalRecords);
          break;
        case '01':
          document.getElementById('elmLoader')?.classList.add('d-none');
          this.toastr.info(resp.message)
          this.loading = false
          break;
      }
    })
  }

  getCustomerById(): void {  
    this.searchingById = true;
    document.getElementById('elmLoader')?.classList.remove('d-none');
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.accounts
      .getLocalAccounts(startIndex.toString(), endIndex.toString(), "SINGLE",'searchObject', this.searchObject,"","")
      .subscribe((resp: any) => {
        switch (resp.messageCode) {
          case "00":
            this.rows = resp.data.info;
            document.getElementById('elmLoader')?.classList.add('d-none');
            this.searchingById = false;


            this.totalRecords = parseInt(resp.recordCount);        

            this.startIndex = startIndex + 1;
            this.endIndex = Math.min(endIndex, this.totalRecords);

            if (this.endIndex > resp.recordCount) {
              this.endIndex = resp.recordCount;
            }
            this.rows = this.rows.slice(this.startIndex - 1, this.endIndex);
            break;
          case "01":
            document.getElementById('elmLoader')?.classList.add('d-none');
            
            if(resp.data){
              this.rows = resp.data.info;
              this.searchingById= false;
              document.getElementById('elmLoader')?.classList.add('d-none');                                

              this.startIndex = startIndex + 1;
              this.endIndex = Math.min(endIndex, this.totalRecords);

              if (this.endIndex > this.totalRecords) {
                this.endIndex = this.totalRecords;
              }
              //this.rows = this.rows.slice(this.startIndex - 1, this.endIndex);
              }
              else{
                this.toastr.info(resp.message);
              }
              
            break;
        }
      });
  }

  searchCustomersByDate(): void {
    this.searchingByDate = true;
    document.getElementById('elmLoader')?.classList.remove('d-none');
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.accounts
      .getLocalAccounts(startIndex.toString(), endIndex.toString(), "SINGLE",'date', "",this.startDate,this.endDate)
      .subscribe((resp: any) => {
        switch (resp.messageCode) {
          case "00":
            document.getElementById('elmLoader')?.classList.add('d-none');  
            if(this.startDate=="" && this.endDate ==""){
              this.toastr.warning("Enter start and end date to filter")
            }
            this.rows = resp.data.info;
            this.searchingByDate = false;
            this.totalRecords = parseInt(resp.recordCount);        
            this.startIndex = startIndex + 1;
            this.endIndex = Math.min(endIndex, this.totalRecords);
            break;
          case "01":
            document.getElementById('elmLoader')?.classList.add('d-none');  
            this.toastr.info(resp.message);
            this.searchingByDate = false;
            break;
        }
      });
  }


 //Fetch all child Accounts
  getChildAccounts(val: any){
    this.page.pageNumber = val.offset;
    this.loading = true
    const start = this.page.pageNumber * this.page.size;
    const end = start + this.page.size
    this.loading = true;
    this.accounts.getLocalAccounts(start.toString(), end.toString(), "CHILD",this.searchBy, this.searchObject,this.startDate,this.endDate).subscribe((resp: any) => {
      switch (resp.messageCode) {
        case '00':
          this.loading = false;
          this.childAccs = resp.data.info          
          this.page.totalElements = resp.recordCount;
          this.page.totalPages = this.page.totalElements / this.page.size;
          break;
        case '01':
          this.toastr.info(resp.message)
          this.loading = false
          break;
      }
    })
  }

  getJointAccounts(val: any){
    this.page.pageNumber = val.offset;
    this.loading = true
    const start = this.page.pageNumber * this.page.size;
    const end = start + this.page.size
    this.loading = true;
    this.accounts.getLocalAccounts(start.toString(), end.toString(), "JOINT",this.searchBy, this.searchObject,this.startDate,this.endDate).subscribe((resp: any) => {
      switch (resp.messageCode) {
        case '00':
          this.loading = false;
          this.jointAccs = resp.data.info
          this.page.totalElements = resp.recordCount;
          this.page.totalPages = this.page.totalElements / this.page.size;
          break;
        case '01':
          this.toastr.info(resp.message)
          this.loading = false
          break;
      }
    })
  }
  getPendingAccounts(val: any){
    this.page.pageNumber = val.offset;
    this.loading = true;
    const start = this.page.pageNumber * this.page.size;
    const end = start + this.page.size
    this.loading = true;
    this.accounts.getPendingAccounts(start.toString(), end.toString(), "PENDING",this.searchBy, this.searchObject,this.startDate,this.endDate).subscribe((resp: any) => {
      switch (resp.messageCode) {
        case '00':
          this.loading = false;
          this.pendingAccs = resp.data.info          
          this.page.totalElements = resp.recordCount;
          this.page.totalPages = this.page.totalElements / this.page.size;
          break;
        case '01':
          this.toastr.info(resp.message)
          this.loading = false
          break;
      }
    })
  }
    


  /**
   * Delete Model Open
   */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

onPageChange(event: any) {
  this.currentPage = event;
  this.getAccounts();
}

  viewAccount(groupCode: string){
    this.router.navigate(['app/accounts/account-details/','Y', groupCode]);
  }

  exportexcel(): void
  {
    this.toastr.info('Generating Excel...','',{timeOut:1000});
    const fileName = "Accounts List.xlsx";
    /* pass here the table id */
    let element = document.getElementById('customerTable');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, fileName);
 
  
}
}

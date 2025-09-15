import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbPaginationConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

import { NgbdListSortableHeader } from '../../reports/kra-logs/kra-logs.directive';
import { AccountsListService } from '../accounts-list.service';
import { AccountsService } from 'src/app/core/services/accounts.service';

type DateRange ={
  from: any;
  to: any;
}
@Component({
  selector: 'app-joint-accounts',
  templateUrl: './joint-accounts.component.html',
  styleUrls: ['./joint-accounts.component.scss'],
  providers: [AccountsListService, AccountsService, DecimalPipe]
})
export class JointAccountsComponent {
 // bread crumb items
 breadCrumbItems!: Array<{}>;
 ordersForm!: FormGroup;
 masterSelected!: boolean;
 checkedList: any;
 submitted = false;

 // Api Data
 content?: any;
 lists?: any;
 econtent?: any;

 rows: any[] = [];
 searchObject: string = "";
 startDate: string = "";
 endDate: string = "";
 searchBy: string = "";
 loading: boolean = false;
 searchingCustomer: boolean = false;
 currentPage = 1;
 selectedIndex: number = -1;
 selectedRow: number = 0;

 //Pagination SEction
 page: any = 1;
 pageSize: any = 50;
 startIndex: number = 0;
 endIndex: number = 3;
 totalRecords: number = 0;
 searchingById: boolean = false;
 searchingByDate: boolean = false;
 selectedDates: DateRange = {
   from: undefined,
   to: undefined
 };

 jointAccs: any[] = [];

 total: number;
 @ViewChildren(NgbdListSortableHeader) headers!: QueryList<NgbdListSortableHeader>;

 constructor(
   private config: NgbPaginationConfig,
   private modalService: NgbModal, 
   public service: AccountsService, 
   private router: Router,
   private toastr: ToastrService,
   private datePipe: DatePipe) {

   this.total = this.totalRecords;

   config.maxSize = 5;
   config.boundaryLinks = true;
 }


 ngOnInit(): void {
   /**
   * BreadCrumb
   */
   this.breadCrumbItems = [
     { label: 'Accounts' },
     { label: 'Joint', active: true }
   ];

 this.getJointAccounts();
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

 getJointAccounts(){ 
  this.loading = true;
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.service.getLocalAccounts(this.startIndex.toString(), this.endIndex.toString(), "JOINT",this.searchBy, this.searchObject,this.startDate,this.endDate).subscribe((resp: any) => {
    switch (resp.messageCode) {
      case '00':
        document.getElementById('elmLoader')?.classList.add('d-none');
        this.loading = false;
        this.jointAccs = resp.data.info
        this.totalRecords = parseInt(resp.recordCount);      
        this.startIndex = startIndex + 1;
        this.endIndex = Math.min(endIndex, this.totalRecords);
        break;
      case '01':
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
  this.service
    .getLocalAccounts(startIndex.toString(), endIndex.toString(), "JOINT",'searchObject', this.searchObject,"","")
    .subscribe((resp: any) => {
      switch (resp.messageCode) {
        case "00":
          this.jointAccs = resp.data.info;
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
  this.service
    .getLocalAccounts(startIndex.toString(), endIndex.toString(), "JOINT",'date', "",this.startDate,this.endDate)
    .subscribe((resp: any) => {
      switch (resp.messageCode) {
        case "00":
          document.getElementById('elmLoader')?.classList.add('d-none');  
          if(this.startDate=="" && this.endDate ==""){
            this.toastr.warning("Enter start and end date to filter")
          }
          this.jointAccs = resp.data.info;
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


 onPageChange(event: any) {
   this.currentPage = event;
   this.getJointAccounts();
 }

 viewAccount(groupCode: string){
  this.router.navigate(['app/accounts/account-details/', groupCode]);
}



}

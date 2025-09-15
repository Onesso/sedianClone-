import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ApplicationModel } from '../../accounts/acounts-list/accounts-list.model';
import { AccountsListService } from '../../accounts/accounts-list.service';
import { NgbdappSortableHeader, appSortEvent } from '../../accounts/acounts-list/application-sortable.directive';
import { SettingsService } from '../../settings/settings.service';
import { DecimalPipe } from '@angular/common';
import { ApplicationStatusService } from '../application-status.service';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';

type DateRange ={
  from: any;
  to: any;
}

@Component({
  selector: 'app-application-status',
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.scss'],
  providers:[AccountsListService, SettingsService,DecimalPipe]
})
export class ApplicationStatusComponent implements OnInit {
   // bread crumb items
   breadCrumbItems!: Array<{}>;
   applications: any;
   masterSelected!: boolean;
   @ViewChildren(NgbdappSortableHeader) headers!: QueryList<NgbdappSortableHeader>;
   // Form
   applicationData!: UntypedFormGroup;
   submitted = false;
   loading = false;
   searchingCustomer: boolean = false;
 
   temp: any[] = [];
   rows: any[] = [];

   completeFlag: string = "";  
   searchBy: string = "";  
   searchObject: string = ""; 
   searchingByDate: boolean = false; 
   selectedDates: DateRange = {
     from: undefined,
     to: undefined
   };
   startDate: string = "";
   endDate: string = "";

    //Pagination SEction
    currentPage: any = 1;
    pageSize: any = 50;
    startIndex: number = 0;
    endIndex: number = 3;
    totalRecords: number = 0;
    selectedStartDate: string = "";
    selectedEndDate: string = "";
 
   // Table data
   Applicationlist!: Observable<ApplicationModel[]>;
   total: Observable<number>;
   constructor(
     public service: AccountsListService,
     public formBuilder: UntypedFormBuilder,
     public modalService: NgbModal,
     private telemetry: ApplicationStatusService,
     private  settingsService: SettingsService,
     private toastr: ToastrService
     ) {
     this.Applicationlist = service.countries$;
     this.total = service.total$;
   }
 
 
   ngOnInit(): void { 
     this.breadCrumbItems = [
       { label: 'Product Setup' },
       { label: 'Account Type', active: true }
     ];
 
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

     this.getTelemetry();
 
   
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
 
 
 
   editModal(content: any,id:any) {
     this.submitted = false;
     this.modalService.open(content, { size: 'md', centered: true });
     var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
     updateBtn.innerHTML = "Update";
   }
 

   getTelemetry() {
    this.loading = true;
    document.getElementById('elmLoader')?.classList.remove('d-none');
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.telemetry
      .filterTelemtry(startIndex.toString(), endIndex.toString(),this.completeFlag, this.startDate, this.endDate,this.searchObject,this.searchBy)
      .subscribe((resp: any) => {

        switch (resp.messageCode) {
          case "00":
            this.rows = (resp.data.info).reverse();
            document.getElementById('elmLoader')?.classList.add('d-none');
    
            this.loading = false;

            this.totalRecords = parseInt(resp.recordCount);        

            this.startIndex = startIndex + 1;
            this.endIndex = Math.min(endIndex, this.totalRecords);

            if (this.endIndex > resp.recordCount) {
              this.endIndex = resp.recordCount;
            }
            //this.rows = this.rows.slice(this.startIndex - 1, this.endIndex);
            break;
          case "01":
            document.getElementById('elmLoader')?.classList.add('d-none');
            this.toastr.info(resp.message);
            this.loading = false;
            break;
        }      
      });
  }


  getCustomerById(): void {  
    this.searchingCustomer = true;    
    document.getElementById('elmLoader')?.classList.remove('d-none');
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.telemetry
      .filterTelemtry(startIndex.toString(), endIndex.toString(),this.completeFlag, "", "",this.searchObject,"searchObject")
      .subscribe((resp: any) => {
        switch (resp.messageCode) {
          case "00":
            this.rows = resp.data.info;
            document.getElementById('elmLoader')?.classList.add('d-none');
            this.searchingCustomer = false;


            this.totalRecords = parseInt(resp.recordCount);        

            this.startIndex = startIndex + 1;
            this.endIndex = Math.min(endIndex, this.totalRecords);

            if (this.endIndex > resp.recordCount) {
              this.endIndex = resp.recordCount;
            }
           // this.rows = this.rows.slice(this.startIndex - 1, this.endIndex);
            break;
          case "01":
            document.getElementById('elmLoader')?.classList.add('d-none');
            
            if(resp.data){
              this.rows = resp.data.info;
              this.searchingCustomer = false;
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


  filterCustomerByDate(){
    this.searchingByDate = true;    
    document.getElementById('elmLoader')?.classList.remove('d-none');
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.telemetry
      .filterTelemtry(startIndex.toString(), endIndex.toString(),this.completeFlag, this.startDate, this.endDate,"","date")
      .subscribe((resp: any) => {
        switch (resp.messageCode) {
          case "00":
            this.searchingByDate = false;   
            document.getElementById('elmLoader')?.classList.add('d-none'); 
            if(this.startDate=="" && this.endDate ==""){
              this.toastr.warning("Enter start and end date to filter")
            }
            else{
              this.rows = resp.data.info;
            }       
        
                             
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
    this.getTelemetry();
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

  exportexcel(): void
  {
    this.toastr.info('Generating Excel...','',{timeOut:1000});
    const fileName = "Application Status.xlsx";
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

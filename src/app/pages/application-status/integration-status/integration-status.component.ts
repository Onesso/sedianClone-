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
import { start, end } from '@popperjs/core';
import { ApplicationStatusService } from '../application-status.service';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-integration-status',
  templateUrl: './integration-status.component.html',
  styleUrls: ['./integration-status.component.scss'],
  providers:[AccountsListService, SettingsService,DecimalPipe]
})
export class IntegrationStatusComponent implements OnInit {
   // bread crumb items
   breadCrumbItems!: Array<{}>;
   applications: any;
   masterSelected!: boolean;
   @ViewChildren(NgbdappSortableHeader) headers!: QueryList<NgbdappSortableHeader>;
   // Form
   applicationData!: UntypedFormGroup;
   submitted = false;
   loading = false;
   searchObject: string = ""; 
 
   temp: any[] = [];
   rows: any[] = [];

    //Pagination SEction
    currentPage: any = 1;
    pageSize: any = 50;
    startIndex: number = 0;
    endIndex: number = 3;
    totalRecords: number = 0;

    searchingCustomer: boolean = false;
 
   // Table data
   Applicationlist!: Observable<ApplicationModel[]>;

   constructor(   
     public formBuilder: UntypedFormBuilder,
     public modalService: NgbModal,
     private  settingsService: SettingsService,
     private service: ApplicationStatusService,
     private toastr: ToastrService
     ) {
 
   }
 
 
   ngOnInit(): void {
     /**
 * BreadCrumb
 */
     this.breadCrumbItems = [
       { label: 'Application Status' },
       { label: 'Intergration Status', active: true }
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

     this.getStatus();
 
   }
 
 
   editModal(content: any,id:any) {
     this.submitted = false;
     this.modalService.open(content, { size: 'md', centered: true });
     var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
     updateBtn.innerHTML = "Update";
   }

   getStatus() {
    this.loading = true; 
    document.getElementById('elmLoader')?.classList.remove('d-none');
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;  

    this.service.getApplicationServices(startIndex.toString(), endIndex.toString(), "").subscribe((resp: any) => {
      switch (resp.messageCode) {
        case '00':
          this.rows = (resp.data.info).reverse();
          document.getElementById('elmLoader')?.classList.add('d-none');
    
            this.loading = false;

            this.totalRecords = parseInt(resp.recordCount);        

            this.startIndex = startIndex + 1;
            this.endIndex = Math.min(endIndex, this.totalRecords);

            if (this.endIndex > resp.recordCount) {
              this.endIndex = resp.recordCount;
            }
          break;
        case '01':
          this.toastr.info(resp.message);
          document.getElementById('elmLoader')?.classList.add('d-none');
          this.loading = false
          break;
      }

    })
  }

  getCustomerByObject(){
    this.searchingCustomer = true; 
    document.getElementById('elmLoader')?.classList.remove('d-none');
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;  

    this.service.getApplicationServices(startIndex.toString(), endIndex.toString(), this.searchObject).subscribe((resp: any) => {
      switch (resp.messageCode) {
        case '00':
          this.rows = resp.data.info
          document.getElementById('elmLoader')?.classList.add('d-none');
    
            this.searchingCustomer = false;

            this.totalRecords = parseInt(resp.recordCount);        

            this.startIndex = startIndex + 1;
            this.endIndex = Math.min(endIndex, this.totalRecords);

            if (this.endIndex > resp.recordCount) {
              this.endIndex = resp.recordCount;
            }
          break;
        case '01':
          this.toastr.info(resp.message);
          document.getElementById('elmLoader')?.classList.add('d-none');
          this.searchingCustomer = false
          break;
      }

    })
  }

   onPageChange(event: any) {
    this.currentPage = event;
    this.getStatus();
  }

  exportexcel(): void
  {
    this.toastr.info('Generating Excel...','',{timeOut:1000});
    const fileName = "Integration Status.xlsx";
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

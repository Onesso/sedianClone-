import { ReportsService } from './../reports.service';
import { ToastrService } from 'ngx-toastr';
import {Component, QueryList, ViewChildren} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, Validators } from '@angular/forms';

// Sweet Alert
import Swal from 'sweetalert2';

import { ListJsModel, paginationModel } from './kra-logs.model';
import { paginationlist, dataattribute, existingList, FuzzyList } from './data';
import { OrdersService } from './kra-logs.service';
import { NgbdListSortableHeader, listSortEvent } from './kra-logs.directive';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-kra-logs',
  templateUrl: './kra-logs.component.html',
  styleUrls: ['./kra-logs.component.scss'],
  providers: [OrdersService, DecimalPipe]

})

/**
 * Listjs table Component
 */
export class KraLogsComponent {
  breadCrumbItems!: Array<{}>;
  currentPage: any = 1;
  pageSize: any = 200;
  startIndex: number = 0;
  endIndex: number = 200;
  totalRecords: number = 0;

  searchObject: string = "";
  startDate: string = "";
  endDate: string = "";
  searchBy: string = "";
  searchingCustomer: boolean = false;
  loading: boolean = false;
  rows: any[] = [];


  constructor(
    private modalService: NgbModal,
    public service: ReportsService,
     private formBuilder: UntypedFormBuilder,
     private toastr: ToastrService,

     ) {

  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Kra Logs', active: true }
    ];

    this.fetchLogs();
   
  }




  fetchLogs(): void {   
    this.loading= true;
    document.getElementById('elmLoader')?.classList.remove('d-none');
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.service.getKraLogs(startIndex.toString(), endIndex.toString(), "").subscribe((resp: any) => {
      switch (resp.messageCode){
        case '00':
          this.rows = resp.data.info;
          document.getElementById('elmLoader')?.classList.add('d-none');
          this.loading = false; 


          this.totalRecords = parseInt(resp.recordCount);        

          this.startIndex = startIndex + 1;
          this.endIndex = Math.min(endIndex, this.totalRecords);

          break;
        case '01':
          this.searchingCustomer = false;
          this.toastr.info(resp.message)
          this.loading = false
          break;
      }
    })
  }


  
   searchRecord(){
    this.searchingCustomer= true;
    document.getElementById('elmLoader')?.classList.remove('d-none');
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.service.getKraLogs(startIndex.toString(), endIndex.toString(), this.searchObject).subscribe((resp: any) => {
      switch (resp.messageCode){
        case '00':
          this.rows = resp.data.info;
          document.getElementById('elmLoader')?.classList.add('d-none');
          this.searchingCustomer = false; 


          this.totalRecords = parseInt(resp.recordCount);        

          this.startIndex = startIndex + 1;
          this.endIndex = Math.min(endIndex, this.totalRecords);

          break;
        case '01':
          this.searchingCustomer = false;
          this.toastr.info(resp.message);          
          break;
      }
    })
   }
   onPageChange(event: any) {
     this.currentPage = event;
     this.fetchLogs();
   }
   

  exportexcel(): void
  {
    this.toastr.info('Generating Excel...','',{timeOut:1000});
    const fileName = "KRA Logs.xlsx";
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

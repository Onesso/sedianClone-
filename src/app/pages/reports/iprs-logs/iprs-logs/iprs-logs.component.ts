import { ToastrService } from 'ngx-toastr';
import { ReportsService } from './../../reports.service';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { dataattribute, existingList, FuzzyList, paginationlist } from '../../kra-logs/data';
import { NgbdListSortableHeader } from '../../kra-logs/kra-logs.directive';
import { ListJsModel } from '../../kra-logs/kra-logs.model';
import { OrdersService } from '../../kra-logs/kra-logs.service';
import { DecimalPipe } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-iprs-logs',
  templateUrl: './iprs-logs.component.html',
  styleUrls: ['./iprs-logs.component.scss'],
  providers: [OrdersService, DecimalPipe]
})
export class IprsLogsComponent {
 
  breadCrumbItems!: Array<{}>;
  currentPage: any = 1;
  pageSize: any = 100;
  startIndex: number = 0;
  endIndex: number = 100;
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
    private toastr: ToastrService,
    private fb: FormBuilder
    ) {}

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'IPRS Logs', active: true }
    ];

    this.fetchLogs();

  }


  fetchLogs(): void { 
    this.loading= true;
    document.getElementById('elmLoader')?.classList.remove('d-none');
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.service.getIprsLogs(startIndex.toString(), endIndex.toString(), "").subscribe((resp: any) => {
      switch (resp.messageCode) {
        case '00':
          this.rows = resp.data.info;
          document.getElementById('elmLoader')?.classList.add('d-none');
          this.loading = false;
       
          this.totalRecords = parseInt(resp.recordCount);        

          this.startIndex = startIndex + 1;
          this.endIndex = Math.min(endIndex, this.totalRecords);

          // if (this.endIndex > this.totalRecords) {
          //   this.endIndex = this.totalRecords;
          // }
          // this.rows = this.rows.slice(this.startIndex - 1, this.endIndex);
          break;
        case '01':
        
          this.toastr.info(resp.message)
          this.loading = false
          break;
      }
    })
  }

  searchRecord(){
    this.searchingCustomer = true;
    this.loading= true;
    document.getElementById('elmLoader')?.classList.remove('d-none');
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.service.getIprsLogs(startIndex.toString(), endIndex.toString(), this.searchObject).subscribe((resp: any) => {
      switch (resp.messageCode) {
        case '00':
          this.rows = resp.data.info;
          document.getElementById('elmLoader')?.classList.add('d-none');
          this.loading = false;
          this.searchingCustomer = false;


          this.totalRecords = parseInt(resp.recordCount);        

          this.startIndex = startIndex + 1;
          this.endIndex = Math.min(endIndex, this.totalRecords);

          // if (this.endIndex > this.totalRecords) {
          //   this.endIndex = this.totalRecords;
          // }
          // this.rows = this.rows.slice(this.startIndex - 1, this.endIndex);
          break;
        case '01':
          this.searchingCustomer = false;
          this.toastr.info(resp.message)
          this.loading = false
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
    const fileName = "IPRS Logs.xlsx";
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

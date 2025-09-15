import { DecimalPipe } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { dataattribute, existingList, FuzzyList, paginationlist } from '../kra-logs/data';
import { NgbdListSortableHeader } from '../kra-logs/kra-logs.directive';
import { ListJsModel } from '../kra-logs/kra-logs.model';
import { OrdersService } from '../kra-logs/kra-logs.service';
import { ReportsService } from '../reports.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-failed-iprs',
  templateUrl: './failed-iprs.component.html',
  styleUrls: ['./failed-iprs.component.scss'],
  providers:[OrdersService, DecimalPipe]
})
export class FailedIprsComponent {

  breadCrumbItems!: Array<{}>;
  currentPage: any = 1;
  pageSize: any = 50;
  startIndex: number = 0;
  endIndex: number = 50;
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
    private formBuilder: UntypedFormBuilder,
    private service: ReportsService,
    private toastr: ToastrService
    ) {
      this.breadCrumbItems = [
        { label: 'Reports' },
        { label: 'Failed Iprs Logs', active: true }
      ];
  
  }

  ngOnInit(): void {
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
          const allFailed  = resp.data.info;
          this.rows = allFailed.filter((data: any) => (data.errorCode !== '00' && data.errorCode !== 'ISB-106'))
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
          const allFailed  = resp.data.info;
          this.rows = allFailed.filter((data: any) => (data.errorCode !== '00' && data.errorCode !== 'ISB-106'))
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



}

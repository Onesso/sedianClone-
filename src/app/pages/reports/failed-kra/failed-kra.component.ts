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
import { ToastrService } from 'ngx-toastr';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-failed-kra',
  templateUrl: './failed-kra.component.html',
  styleUrls: ['./failed-kra.component.scss'],
  providers:[OrdersService, DecimalPipe]
})
export class FailedKraComponent {
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
    
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
    private service: ReportsService


    ) {
   
  }

  ngOnInit(): void {   
     this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Failed Kra Logs', active: true }
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
          const allFailed = resp.data.info;
          this.rows = allFailed.filter((data: any) => (data.statusCode === '25002'))
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
    this.service.getKraLogs(startIndex.toString(), endIndex.toString(), this.searchObject).subscribe((resp: any) => {
      switch (resp.messageCode){
        case '00':
          const allFailed = resp.data.info;
          this.rows = allFailed.filter((data: any) => (data.statusCode === '25002'));
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

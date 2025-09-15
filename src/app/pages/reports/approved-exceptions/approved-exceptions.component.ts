import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportsService } from './../reports.service';
import * as XLSX from 'xlsx';

type DateRange ={
  from: any;
  to: any;
}
@Component({
  selector: 'app-approved-exceptions',
  templateUrl: './approved-exceptions.component.html',
  styleUrls: ['./approved-exceptions.component.scss']
})
export class ApprovedExceptionsComponent {

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
  approved: any = [];
  selectedStartDate: string = "";
  selectedEndDate: string = "";

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
      { label: 'Reports' },
      { label: 'Approved Reports', active: true }
    ];
    this.fetchReport();
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

formatDate(date: any) {
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0');
  var yyyy = date.getFullYear();
  let today = yyyy + '-' + mm + '-' + dd
  return today
}


  fetchReport(): void {   
    this.loading= true;
    document.getElementById('elmLoader')?.classList.remove('d-none');
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.service.getExceptionReport(startIndex.toString(), endIndex.toString(), "","").subscribe((resp: any) => {
      switch (resp.messageCode) {
        case '00':
          this.rows = resp.data.info;
          this.approved =this.rows.filter(data => data.approveRejected === 'ACCEPTED');          
          document.getElementById('elmLoader')?.classList.add('d-none');
          this.loading = false;          

          this.totalRecords = this.approved.length;        

          this.startIndex = startIndex + 1;
          this.endIndex = Math.min(endIndex, this.totalRecords);

          if (this.endIndex > this.totalRecords) {
            this.endIndex = this.totalRecords;
          }
          this.approved = this.approved.slice(this.startIndex - 1, this.endIndex);
          break;
        case '01':
          this.searchingCustomer = false;
          this.toastr.info(resp.message)
          this.loading = false
          break;
      }
    })
  }

  searchRecordByDate(){
    if(this.startDate === '' && this.endDate === ''){
      this.toastr.warning('Provide the start date and end date yoiu want to search');
      return;
    }
    this.searchingCustomer = true;    
    document.getElementById('elmLoader')?.classList.remove('d-none');
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.service.getExceptionReport(startIndex.toString(), endIndex.toString(), this.startDate,this.endDate).subscribe((resp: any) => {
      switch (resp.messageCode) {
        case '00':
          this.rows = resp.data.info;
          this.approved =this.rows.filter(data => data.approveRejected === 'ACCEPTED'); 
          document.getElementById('elmLoader')?.classList.add('d-none');        
          this.searchingCustomer = false;

          this.totalRecords = this.approved.length;        

          this.startIndex = startIndex + 1;
          this.endIndex = Math.min(endIndex, this.totalRecords);

          if (this.endIndex > this.totalRecords) {
            this.endIndex = this.totalRecords;
          }
          this.approved = this.approved.slice(this.startIndex - 1, this.endIndex);
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
    this.fetchReport();
  }

  exportexcel(): void
  {
    this.toastr.info('Generating Excel...','',{timeOut:1000});
    const fileName = "Approved Exceptions List.xlsx";
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

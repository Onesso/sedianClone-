import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-documents-archived',
  templateUrl: './documents-archived.component.html',
  styleUrls: ['./documents-archived.component.scss']
})
export class DocumentsArchivedComponent implements OnInit {
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
      { label: 'Documents Archived', active: true }
    ];

    this.fetchArchivedDocs();
   
  }




  fetchArchivedDocs(): void {
    this.searchingCustomer = true;
    this.loading= true;
    document.getElementById('elmLoader')?.classList.remove('d-none');
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.service.getArchivedDocs(startIndex.toString(), endIndex.toString(), "","").subscribe((resp: any) => {
      switch (resp.messageCode){
        case '00':
          this.rows = (resp.data.info).reverse();
          document.getElementById('elmLoader')?.classList.add('d-none');
          this.loading = false;
          this.searchingCustomer = false;


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

   }
   onPageChange(event: any) {
     this.currentPage = event;
     this.fetchArchivedDocs();
   }
  

}

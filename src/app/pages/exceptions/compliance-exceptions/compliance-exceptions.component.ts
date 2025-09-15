import { Component, QueryList, ViewChildren } from '@angular/core';
import { ExceptionService } from '../exception.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbdListSortableHeader } from '../../reports/kra-logs/kra-logs.directive';
import * as XLSX from 'xlsx';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-compliance-exceptions',
  templateUrl: './compliance-exceptions.component.html',
  styleUrls: ['./compliance-exceptions.component.scss'],
  providers: [ExceptionService,DecimalPipe]
})
export class ComplianceExceptionsComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  ordersForm!: UntypedFormGroup;
  masterSelected!: boolean;
  checkedList: any;
  submitted = false;

  search: string = "";

  // Api Data
  content?: any;
  lists?: any;
  econtent?: any;

  rows: any[] = [];
  temp: any[] = [];
  searchObject: string = "";
  startDate: string = "";
  endDate: string = "";
  searchBy: string = "";
  loading: boolean = false;

  //Pagination SEction
  currentPage: any = 1;
  pageSize: any = 50;
  startIndex: number = 0;
  endIndex: number = 3;
  totalRecords: number = 0;

  exceptionLevel: string = '';
  
  @ViewChildren(NgbdListSortableHeader) headers!: QueryList<NgbdListSortableHeader>;

  constructor(
    private modalService: NgbModal, 
    private router: Router,
    private formBuilder: UntypedFormBuilder, 
    private compliance: ExceptionService, 
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private datePipe: DatePipe) {
  }


  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Exception' },
      { label: 'Compliance', active: true }
    ];

    /**
     * Form Validation
     */
    this.ordersForm = this.formBuilder.group({
      id: ['#VLZ5'],
      ids: [''],
      title: ['', [Validators.required]],
      client: ['', [Validators.required]],
      assigned: ['', [Validators.required]],
      create: ['', [Validators.required]],
      due: ['', [Validators.required]],
      status: ['', [Validators.required]],
      priority: ['', [Validators.required]]
    });

    this.route.params.subscribe((params) => {
      this.exceptionLevel = params["id"];
    })

    this.getCompliance();
  }

  getCompliance() {
    this.loading = true;
    document.getElementById('elmLoader')?.classList.remove('d-none');
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;  
    this.compliance.filterExceptions("CRR", "", "").subscribe(
      (resp: any) => {
        switch (resp.messageCode) {
          case '00':
            this.loading = false
            this.temp = [...resp.data.info];      
            let allRows = resp.data.info; 
         
            if(this.exceptionLevel === 'authorize') this.rows = allRows.filter((d: any) => d.nextLevellApproval === 'N' || d.nextLevellApproval === '')
                
            if(this.exceptionLevel === 'approve') this.rows = allRows.filter((d: any) => d.nextLevellApproval === 'Y');
                
      
            document.getElementById('elmLoader')?.classList.add('d-none');
        
            this.loading = false;

            this.totalRecords =this.rows.length;        

            this.startIndex = startIndex + 1;
            this.endIndex = Math.min(endIndex, this.totalRecords);

            if (this.endIndex > this.totalRecords) {
              this.endIndex = this.totalRecords;
            }
            break;
          case '01':
            this.toastr.info(resp.message)
            this.loading = false
            break;
        }

      },
      (err) => {
        this.toastr.error(err)
      }

    )
  }

  getComplianceById() {
    this.loading = true;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.compliance.filterExceptions("CRR", this.search, this.search).subscribe(
      {
        next: (resp: any) => {      
            switch (resp.messageCode) {
              case '00':
                this.loading = false
                this.temp = [...resp.data.info];
                let allRows = resp.data.info; 
                if(this.exceptionLevel === 'authorize') this.rows = allRows.filter((d: any) => d.nextLevellApproval === 'N' || d.nextLevellApproval === '')
                  
                if(this.exceptionLevel === 'approve') this.rows = allRows.filter((d: any) => d.nextLevellApproval === 'Y');
                         
                this.totalRecords = this.rows.length;        
  
                this.startIndex = startIndex + 1;
                this.endIndex = Math.min(endIndex, this.totalRecords);
  
                if (this.endIndex > this.totalRecords) {
                  this.endIndex = this.totalRecords;
                }
                break;
              case '01':
                this.toastr.info(resp.message)
                this.loading = false
                break;     
          }
        },
        error: (err:HttpErrorResponse) => {
          this.loading = false
          this.toastr.error(err.message);
        },
      }
  
    )
  }

  viewCustomer(data: any){
    sessionStorage.setItem('level',this.exceptionLevel);
    

    if(this.exceptionLevel === 'authorize') this.router.navigate(['app/exception/compliance-details', data.customerNo, data.groupCode]);
    if(this.exceptionLevel === 'approve') this.router.navigate(['app/exception/pending-approval','CRR', data.customerNo,data.groupCode]);
  }

  onPageChange(event: any) {
    this.currentPage = event;
    this.getCompliance();
  }


  num: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 2,
  };

  /**
  * Confirmation mail model
  */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }


  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  /**
   * Form data get
   */
  get form() {
    return this.ordersForm.controls;
  }



  /**
* Sort table data
* @param param0 sort the column
*
*/
back(){
  if(this.exceptionLevel === 'authorize') this.router.navigate(['app/exception/categories'])

    if(this.exceptionLevel === 'approve') this.router.navigate(['app/exception/pedding-approvals'])
}
  
exportexcel(): void
{
  this.toastr.info('Generating Excel...','',{timeOut:1000});
  const fileName = "Compliance Exceptions.xlsx";
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

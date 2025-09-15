import { DecimalPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { NgbdListSortableHeader } from '../../reports/kra-logs/kra-logs.directive';
import { ExceptionService } from '../exception.service';
import * as XLSX from 'xlsx';
import { Branch } from '../../system-users/models';

@Component({
  selector: 'app-pep-exceptions',
  templateUrl: './pep-exceptions.component.html',
  styleUrls: ['./pep-exceptions.component.scss'],
  providers: [ExceptionService, DecimalPipe]
})
export class PepExceptionsComponent {
// bread crumb items
breadCrumbItems!: Array<{}>;
ordersForm!: UntypedFormGroup;
masterSelected!: boolean;
checkedList: any;
submitted = false;

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
branches: Branch[] = [];

page = {
  size: 0,
  totalElements: 0,
  totalPages: 0,
  pageNumber: 0,
};

  //Pagination SEction
  currentPage: any = 1;
  pageSize: any = 50;
  startIndex: number = 0;
  endIndex: number = 3;
  totalRecords: number = 0;
  search: string = "";

  exceptionLevel: string = '';

@ViewChildren(NgbdListSortableHeader) headers!: QueryList<NgbdListSortableHeader>;

constructor(
  private modalService: NgbModal, 
  private router: Router,
  private formBuilder: UntypedFormBuilder, 
  private compliance: ExceptionService,
  private toastr: ToastrService,
  private route: ActivatedRoute,
  private datePipe: DatePipe) {
    this.branches = JSON.parse(sessionStorage.getItem('branches') ?? '');
}


ngOnInit(): void {
  /**
  * BreadCrumb
  */
  this.breadCrumbItems = [
    { label: 'Exception' },
    { label: 'PEP', active: true }
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


  this.page.pageNumber = 0;
  this.page.size = 50;

  this.route.params.subscribe((params) => {
    this.exceptionLevel = params["id"];
  })

  this.getPEPList();
}

getPEPList() {
  this.loading = true;
  document.getElementById('elmLoader')?.classList.remove('d-none');
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;  
  this.compliance.filterExceptions("PEP", "", "").subscribe(
    {
      next: (resp: any) => {      
          switch (resp.messageCode) {
            case '00':
              this.loading = false
              this.temp = [...resp.data.info];
              let allRows = resp.data.info; 
           
              if(this.exceptionLevel === 'authorize') this.rows = allRows.filter((d: any) => d.nextLevellApproval === 'N' || d.nextLevellApproval === '')
                
              if(this.exceptionLevel === 'approve') this.rows = allRows.filter((d: any) => d.nextLevellApproval === 'Y');
                
              document.getElementById('elmLoader')?.classList.add('d-none');
              this.totalRecords = this.rows.length;         

              this.startIndex = startIndex + 1;
              this.endIndex = Math.min(endIndex, this.totalRecords);
  
              if (this.endIndex > resp.recordCount) {
                this.endIndex = this.rows.length; 
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

getPEPListById() {
  this.loading = true;
  document.getElementById('elmLoader')?.classList.remove('d-none');
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;  
  this.compliance.filterExceptions("PEP", this.search, this.search).subscribe(
    {
      next: (resp: any) => {      
          switch (resp.messageCode) {
            case '00':
              this.loading = false
              this.temp = [...resp.data.info];
              let allRows = resp.data.info;
               
              if(this.exceptionLevel === 'authorize') this.rows = allRows.filter((d: any) => d.nextLevellApproval === 'N' || d.nextLevellApproval === '')
                
              if(this.exceptionLevel === 'approve') this.rows = allRows.filter((d: any) => d.nextLevellApproval === 'Y');
                  
              
              document.getElementById('elmLoader')?.classList.add('d-none');
              this.totalRecords = this.rows.length;      

              this.startIndex = startIndex + 1;
              this.endIndex = Math.min(endIndex, this.totalRecords);
  
              if (this.endIndex > resp.recordCount) {
                this.endIndex = resp.recordCount;
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
 

  if(this.exceptionLevel === 'authorize')  this.router.navigate(['app/exception/pep-details', data.customerNo,data.groupCode]);
  if(this.exceptionLevel === 'approve') this.router.navigate(['app/exception/pending-approval', 'PEP', data.customerNo,data.groupCode]);

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

deleteData(deleteId: string){}

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

onPageChange(event: any) {
  this.currentPage = event;
  this.getPEPList();
}

getBranchName(branches: Branch[],code: string){  
  let target = branches.filter((branch) => branch.branchCode === code);
  let targetName = target[0]?.branchName;
  return targetName;
}
}

import { DecimalPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbdListSortableHeader } from '../../reports/kra-logs/kra-logs.directive';
import { ExceptionService } from '../exception.service';
import * as XLSX from 'xlsx';
import { Branch } from '../../system-users/models';

@Component({
  selector: 'app-t24-excetions',
  templateUrl: './t24-excetions.component.html',
  styleUrls: ['./t24-excetions.component.scss'],
  providers: [ExceptionService,  DecimalPipe]
})
export class T24ExcetionsComponent {
// bread crumb items
breadCrumbItems!: Array<{}>;
ordersForm!: UntypedFormGroup;
masterSelected!: boolean;
checkedList: any;
submitted = false;
branches: Branch[] = [];

// Api Data
content?: any;
lists?: any;
econtent?: any;

search: string = "";

rows: any[] = [];
temp: any[] = [];
searchObject: string = "";
startDate: string = "";
endDate: string = "";
searchBy: string = "";
loading: boolean = false;

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
    this.branches = JSON.parse(sessionStorage.getItem('branches') ?? '');
}


ngOnInit(): void {
  /**
  * BreadCrumb
  */
  this.breadCrumbItems = [
    { label: 'Exception' },
    { label: 'T24', active: true }
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

  this.getT24List();
}

getT24List() {
  this.loading = true;
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize; 
  document.getElementById('elmLoader')?.classList.remove('d-none');
  this.compliance.filterExceptions("T24", "", "").subscribe(
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
      error: (err) => {
        this.loading = false
        this.toastr.error(err);        
      },
    }

  )
}

getT24ListById() {
  this.loading = true;
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize; 
  document.getElementById('elmLoader')?.classList.remove('d-none');
  this.compliance.filterExceptions("T24", this.search, this.search).subscribe(
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
  
              if (this.endIndex > this.totalRecords) {
                this.endIndex = this.rows.length; 
              }
              break;
            case '01':
              this.toastr.info(resp.message)
              this.loading = false
              break;     
        }
      },
      error: (err) => {
        this.loading = false
        this.toastr.error(err);        
      }
    }

  )
}

viewCustomer(data: any){  
  sessionStorage.setItem('level',this.exceptionLevel);

  if(this.exceptionLevel === 'authorize') this.router.navigate(['app/exception/t24-details', data.customerNo,data.groupCode]);
  if(this.exceptionLevel === 'approve') this.router.navigate(['app/exception/pending-approval', 'T24',data.customerNo,data.groupCode]);
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
* Multiple Delete
*/
checkedValGet: any[] = [];
deleteMultiple(content: any) {
  var checkboxes: any = document.getElementsByName('checkAll');
  var result
  var checkedVal: any[] = [];
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      result = checkboxes[i].value;
      checkedVal.push(result);
    }
  }
  if (checkedVal.length > 0) {
    this.modalService.open(content, { centered: true });
  }
  else {
    Swal.fire({ text: 'Please select at least one checkbox', confirmButtonColor: '#299cdb', });
  }
  this.checkedValGet = checkedVal;
}

// The master checkbox will check/ uncheck all items
checkUncheckAll(ev: any) {
  this.lists.forEach((x: { state: any; }) => x.state = ev.target.checked)
  var checkedVal: any[] = [];
  var result
  for (var i = 0; i < this.lists.length; i++) {
    if (this.lists[i].state == true) {
      result = this.lists[i];
      checkedVal.push(result);
    }
  }
  this.checkedValGet = checkedVal
  checkedVal.length > 0 ? (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
}

// Select Checkbox value Get
onCheckboxChange(e: any) {
  var checkedVal: any[] = [];
  var result
  for (var i = 0; i < this.lists.length; i++) {
    if (this.lists[i].state == true) {
      result = this.lists[i];
      checkedVal.push(result);
    }
  }
  this.checkedValGet = checkedVal
  checkedVal.length > 0 ? (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
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

// Filtering
isstatus?: any
SearchData() {
  var status = document.getElementById("idStatus") as HTMLInputElement;
  var date = document.getElementById("isDate") as HTMLInputElement;
  var dateVal = date.value ? this.datePipe.transform(new Date(date.value), "yyyy-MM-dd") : '';
  if (status.value != 'all' && status.value != '' || dateVal != '') {
    this.lists = this.content.filter((ticket: any) => {
      return this.datePipe.transform(new Date(ticket.create), "yyyy-MM-dd") == dateVal || ticket.status === status.value;
    });
  }
  else {
    this.lists = this.content;
  }
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
  const fileName = "T24 Exceptions.xlsx";
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
  this.getT24List();
}

getBranchName(branches: Branch[],code: string){  
  let target = branches.filter((branch) => branch.branchCode === code);
  let targetName = target[0]?.branchName;
  return targetName;
}
}

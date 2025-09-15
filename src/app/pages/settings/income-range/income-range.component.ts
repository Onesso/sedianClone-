import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbdappSortableHeader, appSortEvent } from '../../accounts/acounts-list/application-sortable.directive';
import { ApplicationModel } from '../../accounts/acounts-list/accounts-list.model';
import { AccountsListService} from '../../accounts/accounts-list.service';
import { SettingsService } from '../settings.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-income-range',
  templateUrl: './income-range.component.html',
  styleUrls: ['./income-range.component.scss'],
  providers: [AccountsListService, DecimalPipe]
})
export class IncomeRangeComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  applications: any;
  masterSelected!: boolean;
  @ViewChildren(NgbdappSortableHeader) headers!: QueryList<NgbdappSortableHeader>;
  // Form
  applicationData!: FormGroup;
  incomeForm!: FormGroup;
  updateForm!: FormGroup;
  submitted = false;
  loading = false;
  editId: string = "";

  temp: any[] = [];
  rows: any[] = [];

  page: any = 1;
  pageSize: any = 100;
  startIndex: number = 0;
  endIndex: number = 3;
  totalRecords: number = 0;

  // Table data

  constructor(
    public service: AccountsListService,
    public formBuilder: FormBuilder,
    public modalService: NgbModal,
    private settingsService: SettingsService,
    private toastr: ToastrService
    ) {

  }


  ngOnInit(): void {
    /**
* BreadCrumb
*/
    this.breadCrumbItems = [
      { label: 'Settings' },
      { label: 'Income Range', active: true }
    ];

    // Validation
    this.incomeForm = this.formBuilder.group({  
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],    
    });

    this.updateForm = this.formBuilder.group({  
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],    
    });

    this.getIncomeRanges();
  }

  getIncomeRanges() {
    this.loading = true;
    this.settingsService.fetchIncomeRanges().subscribe((data: any) => {
      document.getElementById('elmLoader')?.classList.add('d-none')
      this.temp = [...data.data.info];
      this.rows = data.data.info;
      this.loading = false;
    });
  }

  editModal(content: any,data:any) {
    this.submitted = false;
    this.editId = data.incomeRangeId;
    this.modalService.open(content, { size: 'md', centered: true });
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Update";
    this.updateForm.patchValue({
      name:data.name,
      message: data.message
    })
  }


 

  // Open add Model
  openModel(content: any) {
    this.modalService.open(content, { size: 'md', centered: true });
  }

  get form() {
    return this.incomeForm.controls;
  }

  createRange() {
    const {name, code} = this.incomeForm.value;
    this.loading = true;
    const payload: any = {
      "incomeRangeCode": code,
      "incomeRangeName": name,
      "incomeRangeId": ""
    };
    this.settingsService.addIncomeRange(payload).subscribe({
      next: (resp:any) => {
        switch (resp.messageCode) {
          case '00':  
            this.loading = false; 
            this.toastr.success(resp.message);
            this.modalService.dismissAll();                    
            break;

          case '01':  
            this.loading = false; 
            this.toastr.error(resp.message);          
            break;
        
          default:
            break;
        }
      },
      error: (err) => {
        this.loading = false; 
        this.toastr.error(err); 
      }
    })
       
  }


 updateRange() {
    const {name, code} = this.incomeForm.value;
    this.loading = true;
    const payload: any = {
      "incomeRangeCode": code,
      "incomeRangeName": name,
      "incomeRangeId": ""
    };
    this.settingsService.updateIncomeRange(payload,this.editId).subscribe({
      next: (resp:any) => {
        switch (resp.messageCode) {
          case '00':  
            this.loading = false; 
            this.toastr.success(resp.message);
            this.getIncomeRanges();
            this.modalService.dismissAll();                    
            break;

          case '01':  
            this.loading = false; 
            this.toastr.error(resp.message);          
            break;
        
          default:
            break;
        }
      },
      error: (err) => {
        this.loading = false; 
        this.toastr.error(err); 
      }
    })
       
  }

  /**
   * Delete Model Open
   */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(id: any) {
    
  }

  /**
 * Sort table data
 * @param param0 sort the column
 *
 */
  onSort({ column, direction }: appSortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.appsortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  onPageChange(event: any){

  }


}

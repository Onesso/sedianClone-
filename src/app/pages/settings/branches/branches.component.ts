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
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss'],
  providers: [AccountsListService, DecimalPipe]
})
export class BranchesComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  applications: any;
  masterSelected!: boolean;
  @ViewChildren(NgbdappSortableHeader) headers!: QueryList<NgbdappSortableHeader>;
  // Form
  updateForm!: FormGroup;
  branchForm!: FormGroup;
  submitted = false;
  loading = false;

  temp: any[] = [];
  rows: any[] = [];
  deleteId: any;
  updateId: any;

  page: any = 1;
  pageSize: any = 100;
  startIndex: number = 0;
  endIndex: number = 3;
  totalRecords: number = 0;


  // Table data
  Applicationlist!: Observable<ApplicationModel[]>;
  total: Observable<number>;
  constructor(
    public service: AccountsListService,
    public formBuilder: FormBuilder,
    private toastr: ToastrService,
    public modalService: NgbModal,
    private  settingsService: SettingsService
    ) {
    this.Applicationlist = service.countries$;
    this.total = service.total$;
  }


  ngOnInit(): void {
    /**
* BreadCrumb
*/
    this.breadCrumbItems = [
      { label: 'Settings' },
      { label: 'Branches', active: true }
    ];

    // Validation
    this.branchForm = this.formBuilder.group({     
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      email: ['', [Validators.required]],     
    });

    this.updateForm = this.formBuilder.group({     
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      email: ['', [Validators.required]],     
    });

    this.getBranches();
  }


  editModal(content: any,data:any) {
    this.submitted = false;
    this.updateId = data.branchId;
    this.modalService.open(content, { size: 'md', centered: true });
    this.updateForm.patchValue({
      name:data.branchName,
      code:data.branchCode,
      email:data.branchEmail
    })   
  }

  getBranches() {
    this.loading = true;
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.settingsService.fetchAllBranches().subscribe((data: any) => {
      document.getElementById('elmLoader')?.classList.add('d-none')
      this.temp = [...data.data.info];
      this.rows = data.data.info;
      this.totalRecords = this.rows.length;        

      this.startIndex = startIndex + 1;
      this.endIndex = Math.min(endIndex, this.totalRecords);
      this.loading = false;
    });
  }


  // Open add Model
  openModel(content: any) {
    this.modalService.open(content, { size: 'md', centered: true });
  }

  onPageChange(event: any) {
    this.page = event;
    
  }

 
  get form() {
    return this.branchForm.controls;
  }

  createBranch() {
    this.loading = true;
    const {name,code,email} = this.branchForm.value;
    const payload = {
      branchCode: code.toString(),
      branchName: name,
      branchEmail: email
    }
    this.settingsService.addBranch(payload).subscribe({
      next:(resp) => {
        this.loading = false;
        switch (resp.messageCode) {
          case '00':
            this.toastr.success(resp.message);
            this.modalService.dismissAll(); 
            this.getBranches();           
            break;
          case '01':
            this.toastr.warning(resp.message);          
          break;
        
          default:
            break;
        }    
      },
      error:(err) => {
        this.loading = false;
        this.toastr.error(err);

      }
    })
   
  }

  updateBranch() {
    this.loading = true;
    const {name,code,email} = this.updateForm.value;
    const payload = {
      branchCode: code.toString(),
      branchName: name,
      branchEmail: email
    }
    this.settingsService.updateBranch(payload,this.updateId).subscribe({
      next:(resp) => {
        this.loading = false;
        switch (resp.messageCode) {
          case '00':
            this.toastr.success(resp.message);
            this.modalService.dismissAll(); 
            this.getBranches();           
            break;
          case '01':
            this.toastr.warning(resp.message);          
          break;
        
          default:
            break;
        }    
      },
      error:(err) => {
        this.loading = false;
        this.toastr.error(err);

      }
    })
  }


  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(id: any) {  
    this.loading = true;
    this.settingsService.deleteBranch(this.deleteId).subscribe({
      next:(resp) => {
        this.loading = false;
        switch (resp.messageCode) {
          case '00':
            this.toastr.success(resp.message);
            this.modalService.dismissAll(); 
            this.getBranches();           
            break;
          case '01':
            this.toastr.warning(resp.message);          
          break;
        
          default:
            break;
        }    
      },
      error:(err) => {
        this.loading = false;
        this.toastr.error(err);

      }
    })
    
  }

}

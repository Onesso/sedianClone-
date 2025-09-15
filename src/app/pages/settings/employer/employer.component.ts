import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbdappSortableHeader, appSortEvent } from '../../accounts/acounts-list/application-sortable.directive';
import { ApplicationModel } from '../../accounts/acounts-list/accounts-list.model';
import { AccountsListService } from '../../accounts/accounts-list.service';
import { SettingsService } from '../settings.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employer',
  templateUrl: './employer.component.html',
  styleUrls: ['./employer.component.scss'],
  providers: [AccountsListService, DecimalPipe]
})
export class EmployerComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  applications: any;
  masterSelected!: boolean;
  @ViewChildren(NgbdappSortableHeader) headers!: QueryList<NgbdappSortableHeader>;
  // Form
  employerForm!: FormGroup;
  updateForm!: FormGroup;
  submitted = false;
  loading = false;

  temp: any[] = [];
  rows: any[] = [];
  selectedRowId: string = '';

  // Table data
  Applicationlist!: Observable<ApplicationModel[]>;
  total: Observable<number>;
  constructor(
    public service: AccountsListService,
    public formBuilder: FormBuilder,
    private toastr: ToastrService,
    private settingsService: SettingsService,
    public modalService: NgbModal) {
    this.Applicationlist = service.countries$;
    this.total = service.total$;
  }


  ngOnInit(): void {
    /**
* BreadCrumb
*/
    this.breadCrumbItems = [
      { label: 'Settings' },
      { label: 'Employer', active: true }
    ];

    // Validation
    this.employerForm = this.formBuilder.group({
      code: ['',[Validators.required]],
      name: ['', [Validators.required]],
 
    });

    this.updateForm = this.formBuilder.group({
      code: ['',[Validators.required]],
      name: ['', [Validators.required]],
 
    });

    this.getEmployers();
  }

  getEmployers() {
    this.loading = true;
    this.settingsService.fetchEmployerList().subscribe((data: any) => {
      document.getElementById('elmLoader')?.classList.add('d-none');
      this.temp = [...data.data.info];
      this.rows = data.data.info;
      this.loading = false;
    });
  }

  editModal(content: any,data:any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Update";

    this.selectedRowId = data.companyCode;
  
    this.updateForm.patchValue({
      code: data.companyCode,
      name: data.companyName
    })
  }

  // Open add Model
  openModel(content: any) {
    this.modalService.open(content, { size: 'md', centered: true });
  }

  singleData: any;
  editorder(content: any, id: any) {
   
  }

  /**
* Returns form
*/
  get form() {
    return this.employerForm.controls;
  }



  /**
   * Delete Model Open
   */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  addEmployer(){
    const {code, name} = this.employerForm.value;
    this.loading = true;

    const payload = {
      industryCode: code,
      industryDescription: name
    }

    this.settingsService.addEmployer(payload).subscribe({
      next:(res) =>{
        this.loading = false;
        this.toastr.success("Success");
        this.modalService.dismissAll();
        this.employerForm.reset();
        this.getEmployers();


      },
      error:(err)=> {
        this.loading = false;
        this.toastr.error("Error occured");
        this.modalService.dismissAll();
        this.employerForm.reset();
      }
    })


  }

  // Delete Data
  deleteEmployer() {
   
  }

  updateEmployer(){
    console.log("test");
    const {code, name} = this.updateForm.value;
    this.loading = true;
    const payload = {
      industryCode: code,
      industryDescription: name
    }

    this.settingsService.updateMyEmployer(payload,this.selectedRowId).subscribe({
      next:(res) =>{
        this.loading = false;
        this.toastr.success("Success");
        this.modalService.dismissAll();
        this.employerForm.reset();
        this.getEmployers();


      },
      error:(err)=> {
        this.loading = false;
        this.toastr.error("Error occured");
        this.modalService.dismissAll();
        this.employerForm.reset();
      }
    })
  }


}

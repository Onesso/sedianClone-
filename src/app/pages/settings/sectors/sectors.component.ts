import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AccountsListService } from '../../accounts/accounts-list.service';
import { ApplicationModel } from '../../accounts/acounts-list/accounts-list.model';
import { NgbdappSortableHeader } from '../../accounts/acounts-list/application-sortable.directive';
import { SettingsService } from '../settings.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-sectors',
  templateUrl: './sectors.component.html',
  styleUrls: ['./sectors.component.scss'],
  providers: [AccountsListService, DecimalPipe]
})
export class SectorsComponent {

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

  // Table data
  Applicationlist!: Observable<ApplicationModel[]>;
  total: Observable<number>;
  constructor(
    public service: AccountsListService,
    public formBuilder: FormBuilder,
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
      document.getElementById('elmLoader')?.classList.add('d-none')
      this.temp = [...data.data.info];
      this.rows = data.data.info;
      this.loading = false;
    });
  }

  editModal(content: any,id:any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Update";
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

  }

  // Delete Data
  deleteEmployer() {
   
  }

  updateEmployer(){

  }

}

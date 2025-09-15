import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbdappSortableHeader, appSortEvent } from '../../accounts/acounts-list/application-sortable.directive';
import { ApplicationModel } from '../../accounts/acounts-list/accounts-list.model';
import { AccountsListService } from '../../accounts/accounts-list.service';
import { DecimalPipe } from '@angular/common';
import { SettingsService } from '../settings.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rejection-type',
  templateUrl: './rejection-type.component.html',
  styleUrls: ['./rejection-type.component.scss'],
  providers: [AccountsListService, DecimalPipe]
})
export class RejectionTypeComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  applications: any;
  masterSelected!: boolean;
  @ViewChildren(NgbdappSortableHeader) headers!: QueryList<NgbdappSortableHeader>;
  // Form
  createForm!: FormGroup;
  submitted = false;
  loading = false;
  editId: string = "";

  temp: any[] = [];
  rows: any[] = [];

  // Table data
  Applicationlist!: Observable<ApplicationModel[]>;
  total: Observable<number>;
  constructor(
    public service: AccountsListService,
    public formBuilder: FormBuilder,
    public modalService: NgbModal,
    private toastr: ToastrService,
    private settingsService: SettingsService
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
      { label: 'Rejection Types', active: true }
    ];

    // Validation
    this.createForm = this.formBuilder.group({     
      name: ['', [Validators.required]]
    });

    this.getRejections();
  }

  getRejections() {
    this.loading = true;
    this.settingsService.fetchRejectionTypes().subscribe((data: any) => {
      document.getElementById('elmLoader')?.classList.add('d-none')
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

  }

 



  // Open add Model
  openModel(content: any) {
    this.modalService.open(content, { size: 'md', centered: true });
  }

  // File Upload
  imageURL: string | undefined;
  fileChange(event: any) {
    let fileList: any = (event.target as HTMLInputElement);
    let file: File = fileList.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      document.querySelectorAll('#companylogo-img').forEach((element: any) => {
        element.src = this.imageURL;
      });
    }
    reader.readAsDataURL(file)
  }


  /**
* Returns form
*/
  get form() {
    return this.createForm.controls;
  }

  createRejectionType() {
    this.loading  = true
    const {name} = this.createForm.value;
    const payload = {
      "name": name,
      "recordId": "",
      "createdBy": ""
    }
    this.settingsService.createRejectionType(payload).subscribe({
      next: (resp:any) => {
        switch (resp.messageCode) {
          case '00':  
            this.loading = false; 
            this.toastr.success(resp.message);
            this.getRejections();
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

  updateRejectionType() {
    this.loading  = true
    const {name} = this.createForm.value;
    const payload = {
      "name": name,
      "recordId": "",
      "createdBy": ""
    }
    this.settingsService.editRejectionType(payload,this.editId).subscribe({
      next: (resp:any) => {
        switch (resp.messageCode) {
          case '00':  
            this.loading = false; 
            this.toastr.success(resp.message);
            this.getRejections();
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
}

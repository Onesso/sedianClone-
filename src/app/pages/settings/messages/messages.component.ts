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
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  providers: [AccountsListService, DecimalPipe]
})
export class MessagesComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  applications: any;
  masterSelected!: boolean;
  @ViewChildren(NgbdappSortableHeader) headers!: QueryList<NgbdappSortableHeader>;
  // Form
  messageForm!: FormGroup;
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


  constructor(
    public service: AccountsListService,
    public formBuilder: FormBuilder,
    private toastr: ToastrService,
    private settingsService: SettingsService,
    public modalService: NgbModal) {
   
  }


  ngOnInit(): void {
    /**
* BreadCrumb
*/
    this.breadCrumbItems = [
      { label: 'Settings' },
      { label: 'Messages', active: true }
    ];

    // Validation
    this.messageForm = this.formBuilder.group({    
      name: ['', [Validators.required]],
      message: ['', [Validators.required]],     
    });

    this.updateForm = this.formBuilder.group({    
      name: ['', [Validators.required]],
      message: ['', [Validators.required]],     
    });

    this.getMessages();   
  }

  getMessages() {
    this.loading = true;
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.settingsService.fetchMessages().subscribe((data: any) => {
      document.getElementById('elmLoader')?.classList.add('d-none')
      this.temp = [...data.data.info];
      this.rows = data.data.info;

      this.totalRecords = this.rows.length;        
      this.startIndex = startIndex + 1;
      this.endIndex = Math.min(endIndex, this.totalRecords);
      this.loading = false;
    });
  }

  editModal(content: any,data:any) {
    this.submitted = false;
    this.editId = data.recordId;
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
    return this.messageForm.controls;
  }

  createMessage() {
    const {name, message} = this.messageForm.value;
    this.loading = true;
    // this.settingsService.

  }

  updateMessage(){
    const {name, message} = this.updateForm.value;
    const payload = {
      name:name,
      message: message
    }
    this.loading = true;
    this.settingsService.updateMessage(this.editId,payload).subscribe({
      next:(resp: any)=>{
        switch (resp.messageCode) {
          case '00':  
            this.loading = false; 
            this.toastr.success(resp.message);
            this.getMessages();
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
      error:(err)=>{
        this.loading = false; 
        this.toastr.error(err);
      },
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

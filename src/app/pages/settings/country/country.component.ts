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
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
  providers: [AccountsListService, DecimalPipe]
})
export class CountryComponent implements OnInit {
  
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  applications: any;
  masterSelected!: boolean;
  @ViewChildren(NgbdappSortableHeader) headers!: QueryList<NgbdappSortableHeader>;
  // Form
  countryForm!: FormGroup;
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

  searchTerm: string = "";

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
      { label: 'Product Setup' },
      { label: 'Account Type', active: true }
    ];

    // Validation
    this.countryForm = this.formBuilder.group({    
      name: ['', [Validators.required]],
      code: ['', [Validators.required]]     
    });

    this.updateForm = this.formBuilder.group({    
      name: ['', [Validators.required]],
      code: ['', [Validators.required]]     
    });


    this.getCountrys();
  }

  onPageChange(event: any) {
    this.page = event;    
  }
  getCountrys() {
    this.loading = true;
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.settingsService.fetchAllCountries().subscribe((data: any) => {
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
    this.modalService.open(content, { size: 'md', centered: true });
    this.editId = data.countryId;
    this.updateForm.patchValue({
      name: data.countryName,
      code: data.countryCode
    })
  }


  // Open add Model
  openModel(content: any) {
    this.modalService.open(content, { size: 'md', centered: true });
  }

  
  get form() {
    return this.countryForm.controls;
  }

  createCountry() {
    this.loading = true;
    const {name, code} = this.countryForm.value;
    const payload = {
      countryCode: code.toString(),
      countryName: name,
      token: "",
    }
    this.settingsService.addCountry(payload).subscribe({
      next:(resp) => {
        this.loading = false;
        switch (resp.messageCode) {
          case '00':
            this.toastr.success(resp.message);
            this.modalService.dismissAll(); 
            this.getCountrys();           
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


  updateCountry() {
    this.loading = true;
    const {name, code} = this.updateForm.value;
    const payload = {
      countryCode: code.toString(),
      countryName: name,      
    }
    this.settingsService.updateCountry(payload,this.editId).subscribe({
      next:(resp) => {
        this.loading = false;
        switch (resp.messageCode) {
          case '00':
            this.toastr.success(resp.message);
            this.modalService.dismissAll(); 
            this.getCountrys();           
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
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData() {
    
  }


}

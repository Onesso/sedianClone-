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
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
  providers: [AccountsListService, DecimalPipe]
})
export class CurrencyComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  applications: any;
  masterSelected!: boolean;
  @ViewChildren(NgbdappSortableHeader) headers!: QueryList<NgbdappSortableHeader>;
  // Form
  currencyForm!: FormGroup;
  updateForm!: FormGroup;
  submitted = false;
  loading = false;
  updateId: string = "";


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
      { label: 'Currency', active: true }
    ];

    // Validation
    this.currencyForm = this.formBuilder.group({    
      currencyCode: ['', [Validators.required]],
      currencyName: ['', [Validators.required]]     
    });

    this.updateForm = this.formBuilder.group({    
      currencyCode: ['', [Validators.required]],
      currencyName: ['', [Validators.required]]     
    });

    this.getCurrencies();

  }

  getCurrencies() {
    this.loading = true;
    this.settingsService.fetchCurrencyList().subscribe((data: any) => {
      document.getElementById('elmLoader')?.classList.add('d-none')
      this.temp = [...data.data.info];
      this.rows = data.data.info;
      this.loading = false;
    });
  }

  editModal(content: any,data:any) {
    this.submitted = false;
    this.updateId  = data.currencyId;
    this.modalService.open(content, { size: 'md', centered: true });
    this.updateForm.patchValue({
      currencyCode: data?.currencyCode,
      currencyName: data?.currencyName
    })
  }



 
  isAllChecked() {
    return this.applications.every((_: { state: any; }) => _.state);
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
  * Open modal
  * @param content modal content
  */
  singleData: any;
  editorder(content: any, id: any) {
    
  }

  /**
* Returns form
*/
  get form() {
    return this.currencyForm.controls;
  }

  createapplication() {

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

  deleteCurrency(){
    this.loading = true;  
    this.settingsService.deleteCurrency(this.deleteId).subscribe({
      next:(resp: any) =>{
        this.loading = false
        this.toastr.success(resp.message);
        this.getCurrencies();
        this.modalService.dismissAll();

      },
      error:(err: any) =>{
        this.loading = false;
        this.toastr.error(err);

      }
    })
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

  createCurrency(){
    this.loading = true;
    const {currencyCode, currencyName} = this.currencyForm.value;

    const payload: any = {
      currencyCode:currencyCode.toString(),
      currencyName: currencyName,
      token: "",
    };

    this.settingsService.addCurrency(payload).subscribe({
      next:(resp: any) =>{
        this.loading = false;
        this.toastr.success(resp.message);
        this.modalService.dismissAll();
        this.getCurrencies();
      },
      error:(err: any) =>{
        this.loading = false;
        this.toastr.success(err);
      },
    })

  }

  updateCurrency(){
    this.loading = true;
    const {currencyCode, currencyName} = this.currencyForm.value;

    const payload: any = {
      currencyCode:currencyCode.toString(),
      currencyName: currencyName,     
    };
    this.settingsService.updateCurrency(payload,this.updateId).subscribe({
      next:(resp: any) =>{
        this.loading = false
        this.toastr.success(resp.message);
        this.getCurrencies();
        this.modalService.dismissAll();

      },
      error:(err: any) =>{
        this.loading = false;
        this.toastr.error(err);

      }
    })
  }
}

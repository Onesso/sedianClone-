import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../users.service'
import { Router } from '@angular/router';
import { Branch } from '../../models';
import { Affiliate } from 'src/app/core/models/types';
@Component({
  selector: 'app-affiliates-table',
  templateUrl: './affiliates-table.component.html',
  styleUrls: ['./affiliates-table.component.scss']
})
export class AffiliatesTableComponent {
  breadCrumbItems!: Array<{}>;
  currentPage: any = 1;
  pageSize: any = 200;
  startIndex: number = 0;
  endIndex: number = 200;
  totalRecords: number = 0;

  searchObject: string = "";
  startDate: string = "";
  endDate: string = "";
  searchBy: string = "";
  searchingCustomer: boolean = false;
  loading: boolean = false;
  rows: any[] = [];
  assignForm: FormGroup;
  branchList : Branch[] = [];
  shareData: any;
  notifying: boolean = false;
  notifyingStates: {[email: string]: boolean } = {}

  constructor(
    private modalService: NgbModal,    
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private service: UsersService,
    private router: Router


    ) {
      this.assignForm = this.formBuilder.group({
        username: ["",[Validators.required]],
        branch: ["",[Validators.required]]
      })
      // this.shareData = this.service.getAffiliate()
  }

  ngOnInit(): void {   
     this.breadCrumbItems = [
      { label: 'Affiliates' },
      { label: 'Affiliates', active: true }
    ];
    document.getElementById('elmLoader')?.classList.remove('d-none');

    this.fetchAffiliates();
  }

  fetchAffiliates(): void {   
    this.loading= true;  
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.service.getAffiliates().subscribe(  
      {
        next: (resp: any) => {
          switch (resp.messageCode){
            case '00':
              this.rows = resp.data.affiliates;
              document.getElementById('elmLoader')?.classList.add('d-none');
              this.loading = false;  
              this.totalRecords = parseInt(resp.recordCount); 
              // this.startIndex = startIndex + 1;
              // this.endIndex = Math.min(endIndex, this.totalRecords);    
              break;
    
            case '01':   
              document.getElementById('elmLoader')?.classList.add('d-none');   
              this.toastr.info(resp.message)
              this.loading = false
              break;
          }
        },
        error: (err: any) => {
          document.getElementById('elmLoader')?.classList.add('d-none');
        }
      })
  
    }
  searchAffiliates() {  
    this.loading = true;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.service
      .getAffiliates()
      .subscribe((resp: any) => {
        switch (resp.messageCode) {
          case "00":
            this.loading= false;         
            this.rows = resp.affiliates;
          
            this.totalRecords = parseInt(resp.recordCount);      
            this.startIndex = startIndex + 1;
            this.endIndex = Math.min(endIndex, this.totalRecords);
            break;
          case "01":
            this.toastr.info(resp.message);
            this.loading = false;
            break;
        }
      });
  }

  gotoEdit(affiliate: Affiliate){
    this.service.updateAffiliatesState(affiliate);
    this.router.navigate(['app/system-users/edit-affiliate',affiliate.email]);
  }

  deleteId: string = "";
  removeUser(content: any,data:any){
    this.deleteId = data;
    this.modalService.open(content, { centered: true });
  }

  //Open the assign branch modal
  selectedUser: string = "";
  selectedBranchName: string = "";
  assignBranchModal(content: any,data:any){
    this.modalService.open(content, { size: 'lg', centered: true });
    this.selectedUser = data?.username;
    this.selectedBranchName = data?.branchName;
    this.assignForm.patchValue({
      username: data?.username,
      branch: data?.branchCode

    })
  
  }


  deleteUser() {
    this.loading = true;
    this.service.deleteAffiliate(this.deleteId).subscribe((resp: any) => {
      this.loading = false;
      this.modalService.dismissAll();
      switch (resp.messageCode) {
        case "00":
          this.toastr.success("User frozen Successfully");
          this.modalService.dismissAll();
          this.fetchAffiliates();
          break;
        default:
          this.toastr.warning(resp.message);
          break;
      }
    });
  }


  searchRecord(){

  }
  onPageChange(event: any) {
    this.currentPage = event;
    this.fetchAffiliates();
  }
  
  shareLink(email: string, phone: string, urlLink: string, code: string) {
    this.notifying = true;
    this.notifyingStates[email] = true;
    this.service
      .shareLink(email, phone, urlLink, code)
      .subscribe({
        next: (resp: any) => {
          this.notifying = false;
          this.notifyingStates[email] = false;
          switch (resp.messageCode) {
            case "00":             
              this.toastr.success(resp.message);
              break;
            default:
              this.toastr.warning(resp.message);
              break;
          }
        },
        error: (err)=> {
          this.notifying = false;
          this.notifyingStates[email] = false;
          this.toastr.error(err);
        }
      });
  }
 
}

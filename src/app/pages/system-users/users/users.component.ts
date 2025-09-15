import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { Branch } from '../models';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
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
   
  }

  ngOnInit(): void {   
     this.breadCrumbItems = [
      { label: 'Settings' },
      { label: 'System Users', active: true }
    ];

    this.fetchUsers();
    this.fetchBranches();

  }

  fetchUsers(): void {   
    this.loading= true;
    // document.getElementById('elmLoader')?.classList.remove('d-none');
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.service.getUsers(startIndex.toString(), endIndex.toString(), "","").subscribe((resp: any) => {
      switch (resp.messageCode){
        case '00':
          this.rows = resp.data.userInfo;
          document.getElementById('elmLoader')?.classList.add('d-none');
          this.loading = false;   

          this.totalRecords = parseInt(resp.recordCount);     

          this.startIndex = startIndex + 1;
          this.endIndex = Math.min(endIndex, this.totalRecords);
          break;

        case '01':        
          this.toastr.info(resp.message)
          this.loading = false
          break;
      }
    })
  }

  searchUsers() {  
    this.loading = true;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.service
      .getUsers(startIndex.toString(), endIndex.toString(), "", "")
      .subscribe((resp: any) => {
        switch (resp.messageCode) {
          case "00":
            this.loading= false;         
            this.rows = resp.data.userInfo;
          
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

  searchUserbyId() {
    this.searchingCustomer = true;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.service
      .getUsers(startIndex.toString(), endIndex.toString(), this.searchObject, this.searchObject)
      .subscribe((resp: any) => {
        switch (resp.messageCode) {
          case "00":
            this.searchingCustomer = false;
     
            this.rows = resp.data.userInfo;

            this.totalRecords = parseInt(resp.recordCount);      
            this.startIndex = startIndex + 1;
            this.endIndex = Math.min(endIndex, this.totalRecords);
            break;
          case "01":
            this.toastr.warning(resp.message);
            this.searchingCustomer = false;
            break;
        }
      });
  }

  fetchBranches() {
    this.loading = true;
    this.service.getBranches().subscribe((resp: any) => {
      switch (resp.messageCode) {
        case "00":
          this.loading = false;
          this.branchList = resp.data.info;

          // this.rows = resp.data.info
          break;
        case "01":
          this.toastr.info(resp.message);
          this.loading = false;
          break;
      }
    });
  }


  gotoEdit(data: any){
    this.router.navigate(['app/system-users/edit-user',data.userId]);  
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



  assignBranch() {
    this.loading = true
    const payload = {
      "recordId": "",
      "userId": this.selectedUser,
      "branchCode": this.assignForm.value.branch,
      "baranchName": this.selectedBranchName, 
       "createdDate": ""
    }

    this.service.assignBranch(payload).subscribe((resp: any) => {
      this.loading = false
      this.modalService.dismissAll();
      this.toastr.success(resp.message)
    })
  }

  deleteUser() {
    this.loading = true;
    this.service.deleteUser(this.deleteId).subscribe((resp: any) => {
      this.loading = false;
      this.modalService.dismissAll();
      switch (resp.messageCode) {
        case "00":
          this.toastr.success("User frozen Successfully");
          this.modalService.dismissAll();
          //this.getUser();
          break;
        default:
          this.toastr.warning(resp.message);
          break;
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event;
    this.fetchUsers();
  }
  
 
}

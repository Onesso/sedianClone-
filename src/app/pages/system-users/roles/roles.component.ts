import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent {
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
  deleteLoading: boolean = false;
  rows: any[] = [];
  assignForm: FormGroup;

  constructor(
    private modalService: NgbModal,    
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private service: UsersService,
    private router: Router


    ) {
      this.assignForm = this.formBuilder.group({

      })
   
  }

  ngOnInit(): void {   
     this.breadCrumbItems = [
      { label: 'Settings' },
      { label: 'System Users', active: true }
    ];
    this.fetchRoles();
  }

  fetchRoles(): void {    
    this.loading= true;
    document.getElementById('elmLoader')?.classList.remove('d-none');  
    this.service.findUserRoles().subscribe((resp: any) => {
      switch (resp.messageCode){
        case '00':
          this.rows = resp.data.info;
          document.getElementById('elmLoader')?.classList.add('d-none');
          this.loading = false;        
          this.totalRecords = this.rows.length;       
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

  
  assignBranchModal(data:any){   
    this.router.navigate(['app/system-users/edit-role',data.groupCode])

  }

  deleteId: string = ""
  removeUser(content: any,data:any){
    this.deleteId = data.groupCode;
    this.modalService.open(content, { centered: true });

  }



  deleteRole(){
    this.loading = true;
    this.service.deleteRole(this.deleteId).subscribe((resp: any) => {
      switch (resp.messageCode) {
        case "00":
          this.deleteLoading = false;
          this.modalService.dismissAll();
          this.fetchRoles();
          break;
        default:
          this.deleteLoading = false;
          this.modalService.dismissAll();
          this.fetchRoles();
          this.toastr.warning(resp.message);
          break;
      }
    });
  }


  searchRecord(){

  }
  onPageChange(event: any) {
    this.currentPage = event;
    this.fetchRoles();
  }
  
}

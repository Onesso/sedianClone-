import { Component } from '@angular/core';
import { UsersService } from '../users.service';
import { ToastrService } from 'ngx-toastr';
import { Branch } from '../models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  loading: boolean = false;
  userForm: FormGroup;

  roleList: any[] = [];
  branchList : Branch[] = [];

  constructor(
    private service: UsersService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,

  ) { 
    this.userForm = this.fb.group({      
      branchCode: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],     
      username: ["", Validators.required],
      userGroup: [""],
      surname: ["", Validators.required],
      otherNames: ["", Validators.required],
      phoneNo: ["", Validators.required],
      frozenYN: ["", Validators.required],
      branchHeadYN: ["", Validators.required],
      sendNotifications: ["", Validators.required],
      roleId: ["", Validators.required],
      alertType: ["", Validators.required],
    });
  }

  ngOnInit(): void {    
     this.breadCrumbItems = [
      { label: 'System Users' },
      { label: 'New User', active: true }
    ];

    this.fetchRoles();
    this.fetchBranches();
  }

  fetchRoles() {
    this.service.findUserRoles().subscribe((resp: any) => {
      switch (resp.messageCode) {
        case "00":
          this.loading = false;
          this.roleList = resp.data.info;

          break;
        case "01":
          this.toastr.info(resp.message);
          this.loading = false;
          break;
      }
    });
  }

  fetchBranches() {
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

  saveUser(){
    this.loading = true;
    const formData = this.userForm.value;
    const payload = {
      salesAgentYN: "Y",
      branchCode: formData.branchCode,
      email: formData.email,
      username: formData.username,
      surname: formData.surname,
      phoneNo: formData.phoneNo,
      otherNames: formData.otherNames,
      frozenYN: formData.frozenYN,
      branchHeadYN: formData.branchHeadYN,
      notificationFlag: formData.sendNotifications,
      roleId: formData.roleId,
      alertType: formData.alertType
    };

    this.service.addSystemUser(payload).subscribe({
      next: (resp: any) => {
        switch (resp.messageCode) {
          case "00":
            this.loading = false;
            this.service.addSystemUser(payload);
            this.toastr.success(resp.message);
            this.router.navigateByUrl("/app/system-users/all");
            break;
          case "01":
            this.loading = false;
            this.toastr.error(resp.message);
            break;
        }
      },

      error: (error) =>{
        this.loading = false;
        this.toastr.error(error);
      }
    });
  }
}

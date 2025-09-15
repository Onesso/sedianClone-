import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Branch } from '../models';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
// bread crumb items
breadCrumbItems!: Array<{}>;
loading: boolean = false;
userForm: FormGroup;

roleList: any[] = [];
branchList : Branch[] = [];
userId: string = "";

constructor(
  private service: UsersService,
  private toastr: ToastrService,
  private fb: FormBuilder,
  private router: Router,
  private route: ActivatedRoute

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

 this.route.params.subscribe((params) => {
    this.loading = true;
    this.userId = params["id"];
    // (+) converts string 'id' to a number
    // In a real app: dispatch action to load the details here.
    this.service.getUser(this.userId).subscribe((resp: any) => {
      this.loading = false;
      document.getElementById('elmLoader')?.classList.add('d-none');
      this.userForm.patchValue({
        departmentCode: resp.data.userInfo.departmentCode,
        branchCode: resp.data.userInfo.branchCode,
        email: resp.data.userInfo.email,
        salesCode: resp.data.userInfo.salesCode,
        username: resp.data.userInfo.username,
        userGroup: resp.data.userInfo.userGroup,
        surname: resp.data.userInfo.surname,
        otherNames: resp.data.userInfo.otherNames,
        phoneNo: resp.data.userInfo.phone,
        salesAgentYN: resp.data.userInfo.salesAgentYN,
        branchHeadYN: resp.data.userInfo.salesAgentYN,
        frozenYN: resp.data.userInfo.frozenYN,
        sendNotifications: resp.data.userInfo.notificationFlag,
        roleId: resp.data.userInfo.roleId,
        alertType: resp.data.userInfo.alertType,
      });
    });
  });

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
        break;
      case "01":
        this.toastr.info(resp.message);
        this.loading = false;
        break;
    }
  });
}

updateUser(){
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
    alertType: formData.alertType,
  };

  this.service.updateUser(payload, this.userId).subscribe({
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

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Branch } from '../models';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss']
})
export class NewRoleComponent implements OnInit {
// bread crumb items
breadCrumbItems!: Array<{}>;
loading: boolean = false;
userForm: FormGroup;

roleList: any[] = [];
branchList : Branch[] = [];
rolesObject:any;
authorizationLevels = [];
authLoading: boolean = false;
permissionUpdated: boolean = false;

mainMenu = {
  DashboardMenu: {
    name: "Dashboard Menu", 
    menus: [
      {
        name: "Read",
        id:1,
        allow: false,
        url: "",
      },
      {
        name: "Write",
        id:2,
        allow: false,
        url: "",
      }      
    ],
  },
  ReportsMenu:{
    name: "Reports Menu",
    menus: [
      {
        name: "Read",
        id:4,
        allow: false,
        url: "",
      },
      {
        name: "Write",
        id:5,
        allow: false,
        url: "",
      },
    ],

  },
  SettingsMenu:{
    name: "Settings Menu",
    menus: [
      {
        name: "Read",
        id:7,
        allow: false,
        url: "",
      },
      {
        name: "Write",
        id:8,
        allow: false,
        url: "",
      },
    ],

  },
  MarketingMenu:{
    name: "Marketing Menu",
    menus: [
      {
        name: "Read",
        id:10,
        allow: false,
        url: "",
      },
      {
        name: "Write",
        id:11,
        allow: false,
        url: "",
      }      
    ],
  }
};

constructor(
  private service: UsersService,
  private toastr: ToastrService,
  private fb: FormBuilder,
  private router: Router,

) { 
  this.userForm = this.fb.group({      
    name: ["", Validators.required], 
  });
}

ngOnInit(): void {    
   this.breadCrumbItems = [
    { label: 'System Users' },
    { label: 'New Role', active: true }
  ]; 
  this.fetchAuthorization();
}

testData(event: any, index: number,menu: string,permission: any) {
  this.permissionUpdated = true; 


  if (event.target.checked) {
    switch(menu){
      case 'dashboard':
        this.mainMenu.DashboardMenu.menus[index].allow = true;
      break;
      case 'reports':
        this.mainMenu.ReportsMenu.menus[index].allow = true;
        break;
      case 'settings':
        this.mainMenu.SettingsMenu.menus[index].allow = true;
        break;
      case 'marketing':
        this.mainMenu.MarketingMenu.menus[index].allow = true;
        break;
      default:
        break;       
    }    
  }
   else {
    switch(menu){
      case 'dashboard':
        this.mainMenu.DashboardMenu.menus[index].allow = false;
      break;
      case 'reports':
        this.mainMenu.ReportsMenu.menus[index].allow = false;
        break;
      case 'settings':
        this.mainMenu.SettingsMenu.menus[index].allow = false;
        break;
      case 'marketing':
        this.mainMenu.MarketingMenu.menus[index].allow = false;
        break; 
      default:
        break;     
    }  
  }
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

fetchAuthorization() {
  this.authLoading = true;
  this.service.fetchAuthorizationLevels().subscribe((resp: any) => {
    switch (resp.messageCode) {
      case "00":
        // document.getElementById('elmLoader')?.classList.add('d-none');
        this.authorizationLevels = resp.data.object;
        this.authLoading = false;
        break;
      default:
        this.authLoading = false;
        this.toastr.warning(resp.message);
        break;
    }
  });
}

createGroup() {
  this.loading = true;
  const formData = this.userForm.value
  const payload = {
    groupName:formData.name,
    rolesObject:this.mainMenu
};

  this.service.createRole(payload).subscribe({
    next: (resp: any) => {
      switch (resp.messageCode) {
        case "00":
          this.loading = false;
          this.toastr.success(resp.message);
          this.router.navigate(["/app/system-users/roles"]);
          break;
        default:
          this.loading = false;
          this.toastr.warning("Error creating role");
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

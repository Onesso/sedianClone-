import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Branch } from '../models';
import { UsersService } from '../users.service';

type MenuPermission = {
  menus:[
    {
      allow: boolean;
      id: string;
      name: string;
      url?: string;
    }
  ];
  name: string;
  oldMenu: string;
}

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {
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
menus: any = [];
oldMenu = {};
groupCode: string = '';

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
  private route: ActivatedRoute

) { 
  this.userForm = this.fb.group({      
    name: ["", Validators.required], 
  });

  // this.mainMenu = JSON.parse(sessionStorage.getItem('roles') ?? '');
}

ngOnInit(): void {    
   this.breadCrumbItems = [
    { label: 'System Users' },
    { label: 'Edit Role', active: true }
  ]; 
  this.fetchAuthorization();
  this.getRoleById();
}

getRoleById(){
  this.loading = true;
  this.route.params.subscribe((params) => {
    this.groupCode = params["id"];
    this.service.findRoleByCode(this.groupCode).subscribe((resp: any) => {
      this.loading = false;
      var d = JSON.parse(resp.data.info.rolesObject);
      this.mainMenu = d;

      for (const menu in d) {
        let newMenu = {
          name: d[menu].name,
          menus: d[menu].menus,
          oldMenu: menu,
        };
        this.menus.push(newMenu);       
      }

      this.loading = false;
      this.userForm.patchValue({
        name: resp.data.info.groupName,
      });

     
    });
  });
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

updateGroup() {
  // this.loading.loading = true;

  const formData = this.userForm.value;

  const payload = {
    groupName: formData.name,
    rolesObject: this.mainMenu,
  };
  this.loading = true;

  this.service.updateRole(payload, this.groupCode).subscribe((resp: any) => {
    switch (resp.messageCode) {
      case "00":
        this.loading = false;
        this.toastr.success(resp.message);
        this.router.navigate(["/app/system-users/roles"]);
        break;
      default:
        this.loading= false;
        this.toastr.warning(resp.message);
        break;
    }
  });
}

}

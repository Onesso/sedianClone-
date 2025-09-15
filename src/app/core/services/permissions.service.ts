import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  permissions: any = [];

  userPermissions: any = {};
  constructor(private router: Router) {
    
  }
  ngOnInit(): void {
       this.userPermissions = JSON.parse(sessionStorage.getItem("roles") ?? '');
  }




  // isAuthorized(allowedRoles: any): boolean {
  //   if (allowedRoles == null || allowedRoles.length === 0) {
  //     return true;
  //   }
  //   const access = JSON.parse(sessionStorage.getItem("roles") ?? '');

  //   const allowed = allowedRoles;

  //   for (const menu in access) {
  //     let permissionMenu = {
  //       name: access[menu].name,
  //       perm: access[menu].menus,
  //     };
  //     this.permissions.push(permissionMenu);
  //   }

  //   let view = this.permissions.findIndex((value: any) => {
  //     return value.name == allowedRoles[0].name;
  //   });

  //   let menuPerm = this.permissions[view].perm.findIndex((value: any) => {
  //     return value.name == allowedRoles[0].perm[0].name;
  //   });

  //   if (view >= 0 && menuPerm >= 0) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // performAction(allowedRoles: any, action: any): boolean {
  //   if (allowedRoles == null || allowedRoles.length === 0) {
  //     return true;
  //   }
  //   const access = JSON.parse(sessionStorage.getItem("roles") ?? '');

  //   const allowed = allowedRoles;

  //   for (const menu in access) {
  //     let permissionMenu = {
  //       name: access[menu].name,
  //       perm: access[menu].menus,
  //     };
  //     this.permissions.push(permissionMenu);
  //   }

  //   let view = this.permissions.findIndex((value: any) => {
  //     return value.name == allowedRoles[0].name;
  //   });

  //   let menuPerm = this.permissions[view].perm.findIndex((val: any) => {
  //     return val.name == action;
  //   });

  //   if (this.permissions[view].perm[menuPerm].allow == true) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

    // Method to check if a specific permission is allowed
    isPermissionAllowed(menuName: string, actionName: string): boolean {
      const menu = JSON.parse(sessionStorage.getItem("roles") ?? '')[menuName];
      if (!menu) {
        return false; // Menu not found
      }

      const action = menu.menus.find((menuItem: any) => menuItem.name === actionName);
      return action ? action.allow : false; // Return true if action is allowed, otherwise false
    }
}

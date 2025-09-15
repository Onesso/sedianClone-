import { Injectable } from '@angular/core';
import { getFirebaseBackend } from '../../authUtils';
import { LoginPayload, User } from '../models/auth.models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { GlobalComponent } from "../../global-component";
import { Router } from '@angular/router';

const BASE_URL = GlobalComponent.BASE_URL;


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  

@Injectable({ providedIn: 'root' })

/**
 * Auth-service Component
 */
export class AuthenticationService {

    user!: User;
    currentUserValue: any;

    permissions: any = [];
    isAuthenticated: boolean = false;

    private currentUserSubject: BehaviorSubject<User>;
    // public currentUser: Observable<User>;

    constructor(private http: HttpClient,private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
        // this.currentUser = this.currentUserSubject.asObservable();
     }

      // isAuthorized(allowedRoles: any): boolean {
      //   if (allowedRoles == null || allowedRoles.length === 0) {
      //     return true;
      //   }
      //   const access = JSON.parse(sessionStorage.getItem("roles") ?? '');

      //   const allowed = allowedRoles;

      //   for (const menu in access) {
      //     let permissionMenu = {
      //       name: access[menu]?.name,
      //       perm: access[menu]?.menus,
      //     };
      //     this.permissions.push(permissionMenu);
      //   }

      //   let view = this.permissions.findIndex((value: any) => {
      //     return value.name == allowedRoles[0]?.name;
      //   });

      //   let menuPerm = this.permissions[view]?.perm.findIndex((value: any) => {
      //     return value.name == allowedRoles[0]?.perm[0]?.name;
      //   });

      //   if (view >= 0 && menuPerm >= 0) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // }

      isAuthorised(): boolean{
        const group = sessionStorage.getItem('userGroup') ?? '';
        const user = sessionStorage.getItem('user') ?? '';

        if(group !== '' && user !== ''){
          return true;
        }
        else{
          return false;
        }
      }

 
    login(payload: any) {
        return this.http.post(BASE_URL + 'userlogin',payload)
        .pipe(map((val: any) => {
            if (val.userName) {
              this.isAuthenticated = true;
              sessionStorage.setItem('user', JSON.stringify(val.userName));
              this.currentUserSubject.next(val.userName);
            }
            return val;
          }));
    }

    public currentUser(): any {
        return getFirebaseBackend()!.getAuthenticatedUser();
    }

    /**
     * Logout the user
     */
    logout() {
        // logout the user
        // return getFirebaseBackend()!.logout();
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        this.currentUserSubject.next(null!);
        this.router.navigate(['/login']);
    }


}


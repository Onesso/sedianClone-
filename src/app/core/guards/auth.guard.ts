import { Injectable } from "@angular/core";
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

// Auth Services
import { AuthenticationService } from "../services/auth.service";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthGuard {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const allowedRoles = next.data["allowedRoles"];
    const isAuthorized = this.authenticationService.isAuthorised();
    if (!isAuthorized) {
      this.router.navigate(["access"]);
    }
    return isAuthorized;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const allowedRoles = next.data["allowedRoles"];
    const isAuthorized = this.authenticationService.isAuthorised();
    if (!isAuthorized) {
      this.router.navigate(["access"]);
    }
    return isAuthorized;
  }
}

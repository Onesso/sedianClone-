import { Injectable } from '@angular/core';
import { Observable, tap, BehaviorSubject, of } from 'rxjs';
import { Branch, SystemUser} from './models';
import { Affiliate } from 'src/app/core/models/types';
import { GlobalComponent } from 'src/app/global-component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const BASE_URL = GlobalComponent.BASE_URL;

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private affiliateSubject = new BehaviorSubject<Affiliate>({});
  private affiliates$ = this.affiliateSubject.asObservable();

  constructor(
    private http: HttpClient
  ) { }


  getUsers(onset: string, offset: string, cnumber: string, email: string): Observable<SystemUser[]> {
    const params = { onset: onset, offset: offset, cnumber: cnumber, email: email }
    return this.http.get<SystemUser[]>( BASE_URL +  'users/findAllUsers', { params });
  }

  updateAffiliatesState(affiliates: Affiliate): void {
    this.affiliateSubject.next(affiliates);
  }

    // Function to get the value of the observable
    getAffiliateValue(): Observable<Affiliate> {
      return this.affiliates$;
    }

  // getAffiliateById(id: string): Observable<Affiliate | undefined> {
  //   return this.affiliates$.pipe(
  //     map(affiliates => affiliates.find(affiliate => affiliate.email === id))
  //   );
  // }

  getAffiliates(): Observable<Affiliate[]> {
    // const params = { onset: onset, offset: offset, cnumber: cnumber, email: email }
    return this.http.get<Affiliate[]>( BASE_URL +  'affiliates/getAll')
    
  //   return of([
  //     {
  //       affiliateId: 'Affiliate 1',
  //       email: 'user@user.com',
  //       phone: '254712345678',
  //       urlLink: 'urlLink 1',
  //       businessModel: 'Business Model 1',
  //       platform: 'Platform 1',
  //       alias: 'user',
  //       firstName: 'User',
  //       lastName: 'Users',
  //       code: 'hw88d3'
  //     }
  //   ]).pipe(
  //     tap(affiliates => this.updateAffiliatesState(affiliates))
  //   );
  }


  getUser(userId: string) {
    const params = { userId: userId };
    return this.http.get(BASE_URL + 'users/findUser/', { params });
  }

  // getAffiliate(affiliateId: string) {
  //   const params = { affiliateId: affiliateId };
  //   return this.http.get(BASE_URL + 'affiliate/findById', { params });
  // }

  findUserBranchesById(recordId: string) {
    const params = { recordId: recordId };
    return this.http.get(BASE_URL + 'accessBranch/findById', { params });
  }

  // add  a system user
  addSystemUser(payload: any) {
    return this.http.post(BASE_URL + 'users/create', payload)
  }

  addAffiliate(payload: any) {
    return this.http.post(BASE_URL + 'affiliates/add', payload)
  }

  findUserRoles() {
    const params = {};
    return this.http.get(BASE_URL + 'userRoles', {});
  }

    // fetch all branches
    getBranches(): Observable<Branch[]> {
      return this.http.get<Branch[]>(
        BASE_URL + 'branch/branchList',
        {}
      );
    }


  findRoleByCode(groupCode:string): Observable<any> {
    const params = { groupCode: groupCode }
    return this.http.get<any>(
      BASE_URL + 'userRoles/byGroupId',
       {params}
    );
  }



createRole(payload: any) {
  return this.http.post(BASE_URL + 'userRoles', payload)
}


updateRole(payload: any, groupCode: any) {

  return this.http.put(BASE_URL + `userRoles?groupCode=${groupCode}`, payload)
}

deleteRole(userRoleId: string) {
  return this.http.delete(BASE_URL + `userRoles?userRoleId=${userRoleId}`,)
}

fetchAuthorizationLevels() {
  return this.http.get(BASE_URL + `authorizationLevel`)
}


  

  // delete  one user
  deleteUser(userId:string): Observable<any> {
    const params = { userId: userId }
    return this.http.delete<any>(
      BASE_URL + 'users/deleteUser',
       {params}
    );
  }

  deleteUserBranch(recordId:string):Observable<any>{
    const params = {recordId: recordId}
    return this.http.delete<any>( BASE_URL + 'accessBranch/delete',
    {params}
    );
  }

  //Update User
  updateUser(editeduser: any, userId: string): Observable<SystemUser> {
    const params = { userId: userId }
    return this.http.put<any>(
      BASE_URL + 'users/update',
      editeduser, { params }
    );
  }

  updateAffiliate(editedAffiliate: any, affiliateId: string): Observable<any> {
    const params = {affiliateId: affiliateId}
    return this.http.put<any>(
      BASE_URL + 'affiliates/update',
      editedAffiliate, { params }
    );
  }

  //assign user to branch
  assignBranch(payload: any) {
    return this.http.post(BASE_URL + 'accessBranch/create', payload)
  }

  shareLink(email:string, phone: string, urlLink: string, code: string): Observable<any>{ 
    const payload = {
      email: email,
      phone: phone,
      urlLink: urlLink,
      code: code
    }
    return this.http.post(BASE_URL + 'affiliates/share', payload)
  }

  deleteAffiliate(email: string) {
    return this.http.delete(BASE_URL + `affiliates/delete?email=${email}`);
  }
}

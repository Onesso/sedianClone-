import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalComponent } from 'src/app/global-component';
import { environment } from 'src/environments/environment';

const BASE_URL = GlobalComponent.BASE_URL;

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(
    private http: HttpClient
  ) { }

  getLocalAccounts(onset: any, offset: any, accountType: any, searchBy: any, searchObject: any, startDate: any, endDate: any) {
    const params = { onset, offset, accountType, searchBy, searchObject, startDate, endDate }
    return this.http.get(
      BASE_URL + 'localAccount/findLocalAccountsList',
      { params }
    );
  }

  getPendingAccounts(onset: any, offset: any, accountType: any, searchBy: any, searchObject: any, startDate: any, endDate: any) {
    const params = { onset, offset, accountType, searchBy, searchObject, startDate, endDate }
    return this.http.get(
      BASE_URL + 'localAccount/findAllpendingAccounts',
      { params }
    );

  }
}

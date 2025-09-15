import { Injectable } from '@angular/core';

import { GlobalComponent } from "../../global-component";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = GlobalComponent.BASE_URL;


@Injectable({
  providedIn: 'root'
})
export class ApplicationStatusService {

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

  filterTelemtry(onset:string,offset:string,completeFlag:string,dateFrom:string,dateTo:string,searchObject:string,searchBy:string): Observable<any> {
    const params = {
      onset: onset,
      filterYN:"Y",
      completeFlag:completeFlag,
      dateFrom:dateFrom,
      dateTo:dateTo,
      offset: offset,
      searchObject:searchObject,
      searchBy:searchBy
    }
    return this.http.get<any>(
      BASE_URL + 'telemetry/applicationTelemetry',
      {params}
    );
  }
  
  getApplicationServices(onset: string, offset:string, id:string) {
    const params = { onset, offset, id }
    return this.http.get<any[]>(
      BASE_URL + 'applicationServices/microService', { params }
    );
  }
}

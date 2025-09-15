import { Injectable } from '@angular/core';

import { GlobalComponent } from "../../global-component";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = GlobalComponent.BASE_URL;



@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private http: HttpClient
  ) { }

  getKraLogs(onset: string, offset: string, id:string) {
    const params = { onset, offset, id }
    return this.http.get<any[]>(
        BASE_URL + 'applicationServices/kralogs', { params }
    );
  }


  getArchivedDocs(onset: string, offset: string, id:string, email:string) {
    const params = { onset, offset, id }
    return this.http.get(
      BASE_URL + 'datastore/findAll', { params }

    );
  }

  getIprsLogs(onset: string, offset: string, id: string) {
    const params = { onset, offset, id }
    return this.http.get<any[]>(
        BASE_URL +  'applicationServices/iprslogs', { params }
    );
  }


  getExceptionReport(onset: string, offset:string, startDate:string, endDate:string) {
    const params = { onset, offset, startDate, endDate }
    return this.http.get(
      BASE_URL + 'telemetry/kycExceptions',
      { params }
    );
  }

  getRejectedReport(onset:string, offset:string, status:string, startDate:string, endDate:string) {
    const params = { onset, offset, status, startDate, endDate }
    return this.http.get(
      BASE_URL + 'localrejected/findAllRejected',
      { params }
    );
  }

}

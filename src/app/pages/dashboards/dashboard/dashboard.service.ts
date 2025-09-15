import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';


const BASE_URL = GlobalComponent.BASE_URL;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }


  fetchAge() {
    return this.http.get( BASE_URL + 'dashboard/ageAnalysis')
  }

  fetchGender() {
    return this.http.get( BASE_URL + 'dashboard/genderAnalysis')
  }

  fetchKyc() {
    return this.http.get( BASE_URL + 'dashboard/kycAnalysis')
  }

  fetchSales() {
    return this.http.get( BASE_URL + 'dashboard/salesAnalysis')
  }

  fetchAccounts() {
    return this.http.get( BASE_URL + 'dashboard/accounts')
  }
  fetchGraphicalData(){
    return this.http.get( BASE_URL + 'applicationServices/graphicalData')
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


}

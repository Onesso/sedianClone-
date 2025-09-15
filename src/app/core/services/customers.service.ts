import { Injectable } from '@angular/core';

import { GlobalComponent } from "../../global-component";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = GlobalComponent.BASE_URL;

type ValidateKRA = {
  idNo: string;
  idType:string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(
    private http: HttpClient
  ) { }

  getCustomers(onset: string, offset: string,searchBy:string, searchObject: string,startDate:string,endDate:string): Observable<any[]> {
    const params = { onset: onset, offset: offset,searchBy:searchBy, searchObject: searchObject,startDate,endDate}
    return this.http.get<any[]>(
      BASE_URL + 'kyc_info/findAllApplication', { params }
    );
  }

  getCustomerByCustomerNo(custNo: string){
    const params = { custNo }
    return this.http.get<any[]>(
      BASE_URL + 'kyc_info/findKycByCustNo', { params }
    );
  }

  filterCustomerData(filterYN: string, dateFrom:string, dateTo:string, regType:string) {
    const params = { filterYN: filterYN, dateFrom: dateFrom, dateTo: dateTo, reg_type: regType }
    return this.http.get<any[]>(
      BASE_URL + 'kyc_info/customerInfo', { params }
    );
  }

  sendNotification(custNo: string) {
    const params = { customerNumber: custNo }
    const payload = {}
    return this.http.put<any[]>(
      BASE_URL + `kyc_info/triggerNotification?customerNumber=${custNo}`, payload
    );
  }

  repushToIPRS(payload: any) {  
    return this.http.post<any[]>(
      BASE_URL + `repush/iprs`, payload
    );
  }

  validateKra(payload: ValidateKRA) {
    return this.http.post(BASE_URL + 'kyc/validateKra', payload)
  }

  updateIdNumber(payload: any) {
    return this.http.post(BASE_URL + 'kyc/editDoc', payload)
  }

  repushApplication(payload: any) {
    return this.http.put(BASE_URL + 'kyc/approvDoc', payload)
  }
}

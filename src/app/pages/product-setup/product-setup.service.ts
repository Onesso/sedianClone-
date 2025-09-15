import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';
import { environment } from 'src/environments/environment';

const BASE_URL = GlobalComponent.BASE_URL;

@Injectable({
  providedIn: 'root'
})
export class ProductSetupService {

  constructor(
    private http: HttpClient
  ) { }



  listAccountTypes() {
    return this.http.get(
      BASE_URL + 'accountType',
      {}
    );
  }

  listAllAccountTypes() {
    return this.http.get(
      BASE_URL + 'accountType/getAll',
      {}
    );
  }

  fetchAccountType(accountTypeId: string) {
    const params = { accountTypeId }
    return this.http.get(
      BASE_URL + 'accountType', 
      { params }
    );
  }

  createAccountType(payload: any) {
    return this.http.post(
      BASE_URL + 'accountType',
          payload
        );
  }

  updateAccountType(payload:any, id:string) {
    return this.http.put(
      BASE_URL + `accountType?id=${id}`,
      payload
    );
  }

  deleteAccountType(accountTypeId: any) {
    const params = { accountTypeId }
    return this.http.delete(
  BASE_URL + 'accountType',
      { params }
    );
  }

  //Bundle Products
  saveBundleProducts(payload: any) {
    return this.http.post(BASE_URL + 'bundle_product/create', payload);
  }

  getBundleProduct(id: string) {
    const params = { bundledId: id };
    return this.http.get(BASE_URL + 'bundle_product/findById', {
      params,
    });
  }

  getBundleProducts() {
    return this.http.get(BASE_URL + 'bundle_product/findAllBranches');
  }

  getIncomeRanges(): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + 'incomeRange/incomeList',
      {}
    );
  }

  updateBundleProducts(payload: any, id: string,) {
    const params = { bundleId: id };
    return this.http.put(BASE_URL + 'bundle_product/update', payload, {
      params,
    });
  }

  deleteBundleProducts(id: string) {
    const params = { bundleId: id };
    return this.http.delete(BASE_URL + 'bundle_product/delete', {
      params,
    });
  }

  /**
   * Parent Account Endpoints
   */

  createParentAccount(payload: any){
    return this.http.post<any[]>(
      BASE_URL + 'parentAccount/create', payload
    );
  }
  deleteParentAccount(id: string){
    return this.http.delete<any[]>(
      BASE_URL + `parentAccount/delete?id=${id}`
    );
  }

  fetchParentAccounts(){
    return this.http.get(
      BASE_URL + 'parentAccount/findAll'
    );

  }

  editParentAccount(formData: any,params: any){
    return this.http.put(
      BASE_URL + 'parentAccount/update',
      formData,{params}
    );
  }

  fetchParentAccount(id: string){
    const params = { id }
    return this.http.get(
      BASE_URL + 'parentAccount/findone',
      { params }
    );
  }

  fetchAccountSetupList() {
    return this.http.get<any[]>(
      BASE_URL + 'account_setup/findAllProducts'
    );
  }

  createAccountSetup(payload:any) {
    return this.http.post<any[]>(
      BASE_URL + 'account_setup/create', payload
    );
  }

  fetchMapping(displayId: string) {
    const params = { displayId }
    return this.http.get<any[]>(
      BASE_URL + 'accountBundle', { params }
    );
  }

  deleteMapping(id: string) {
    return this.http.delete<any[]>(
      BASE_URL + `accountBundle?id=${id}`
    );
  }

 

  updateAccountSetup(payload: any) {
    return this.http.put<any[]>(
      BASE_URL + 'account_setup/update', payload,
    );
  }

  createMapping(payload:any) {
    return this.http.post<any[]>(
      BASE_URL + 'accountBundle', payload
    );
  }

  approveAccountSetup(id:string,flag: string){
    return this.http.put(
      BASE_URL + `account_setup/approve?id=${id}&flag=${flag}`,{}
    );
  }

  deleteAccountSetup(id: string) {
    return this.http.delete<any[]>(
      BASE_URL + `account_setup/delete?id=${id}`
    );
  }



}

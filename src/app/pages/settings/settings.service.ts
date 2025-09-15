import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';
import { environment } from 'src/environments/environment';

interface Branch {
  _id?: string;
  branchCode: string;
  branchName: string;
  branchEmail: string;
}

interface Employer {
  industryCode: string;
  industryDescription: string;
}


const BASE_URL = GlobalComponent.BASE_URL;

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private http: HttpClient
  ) { }



  listAccountTypes() {
    return this.http.get(
      BASE_URL + 'accountType',
      {}
    );
  }

  fetchAllCountries() {    
    return this.http.get(
      BASE_URL + 'country/countryList', 
      {}
    );
  }


  fetchAllBranches() {    
    return this.http.get(
      BASE_URL + 'branch/branchList', 
      {}
    );
  }

  fetchCurrencyList() {    
    return this.http.get(
      BASE_URL + 'currency/currencyList', 
      {}
    );
  }

  fetchEmployerList() {    
    return this.http.get(
      BASE_URL + 'employer/employerList', 
      {}
    );
  }

  addEmployer(payload: Employer) {    
    return this.http.post(
      BASE_URL + 'industry/single',payload,
      {}
    );
  }

  updateMyEmployer(payload: Employer, id: string) {    
    const params = {industryCode: id}
    return this.http.post(
      BASE_URL + 'industry/update',payload,
      {params}
    );
  }



  fetchIncomeRanges() {    
    return this.http.get(
      BASE_URL + 'incomeRange/incomeList', 
      {}
    );
  }

  fetchRejectionTypes() {    
    return this.http.get(
      BASE_URL + 'rejectedType/findAll', 
      {}
    );
  }

  fetchMessages() {    
    return this.http.get(
      BASE_URL + 'messageMaintenance/findAll', 
      {}
    );
  }

  createAccountType(payload: any) {
    return this.http.post(
      BASE_URL + 'accountType',
          payload
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

  createRejectionType(payload: any){
    return this.http.post( BASE_URL + 'rejectedType/create',payload)
  }

  editRejectionType(payload: any,recordId:string){
    return this.http.put(BASE_URL + 'rejectedType/update?recordId=${recordId}',payload)
  }

  deleteRejectionType(recordId: string){
    const params = {recordId}
    return this.http.delete(BASE_URL + 'rejectedType/delete', {params})
  }

  listRejectionTypes(){
    return this.http.get(BASE_URL + 'rejectedType/findAll')
  }

  listRejectionTypeById(recordId: string){
    const params = {recordId}
    return this.http.get(BASE_URL + 'rejectedType/findById',{params})
  }

  addCountry(newcountry: any): Observable<any> {
    return this.http.post<any>(
      BASE_URL + 'country/create',
      newcountry
    );
  }

  updateCountry(editedcountry: any,id:string): Observable<any> {
    const params = {countryId: id}
    return this.http.put<any>(
      BASE_URL + 'country/update',
      editedcountry,{params},
    );
  }

  deleteCountry(_id: string): Observable<any> {
    const params = {countryId:_id};
    return this.http.delete<any>(
      BASE_URL + 'country/delete',
        {params}
    );
  }


  addBranch(newBranch: Branch): Observable<any> {
    return this.http.post<Branch>(
      BASE_URL + 'branch/create',
      newBranch
    );
  }

  updateBranch(editedBranch: Branch,id:string): Observable<any> {
    const params = {branchId:id}
    return this.http.put<Branch>(
      BASE_URL + 'branch/update',
      editedBranch,{params}
    );
  }

  deleteBranch(_id: string): Observable<any> {
    const params = {branchId:_id};
    return this.http.delete<Branch>(
    BASE_URL + 'branch/delete',
      {params}
    );
  }

  addCurrency(newBranch: any): Observable<any> {
    return this.http.post<any>(
      BASE_URL + 'currency/create',
      newBranch
    );
  }

  updateCurrency(editedCurrency: any, id: string): Observable<any> {
    const params = { currencyId: id }
    return this.http.put<any>(
      BASE_URL + 'currency/update',
      editedCurrency, { params }
    );
  }

  deleteCurrency(id: string): Observable<any> {
    const params = { currencyId: id }
    return this.http.delete<any>(
      BASE_URL + 'currency/delete/',
      { params }
    );
  }

  createEmployer(payload: any) {
    return this.http.post(
      BASE_URL +  'employer/create',
      payload
    );
  }

  //Update employee
  updateEmployer(payload: any, id: string) {
    const params = { employerId: id }
    return this.http.put(
      BASE_URL + 'employer/update',
      payload, { params }
    );
  }

  //delete employer
  deleteEmployer(employerId: string): Observable<any> {
    const params = { employerId: employerId }
    return this.http.delete<any>(
      BASE_URL + 'employer/delete'
      ,{ params }
    );
  }

  updateMessage(recordId:string, payload: any){
    return this.http.put(BASE_URL + `messageMaintenance/update?recordId=${recordId}`, payload)
  }

  addIncomeRange(payload: any){
    return this.http.post(
      BASE_URL +  'incomeRange/create',
      payload
    );
  }

  updateIncomeRange(payload:any,incomeRangeId: string) {

    return this.http.put(
      BASE_URL +  `incomeRange/update?incomeRangeId=${incomeRangeId}`,
      payload
    );
  }

  deleteIncomeRange(incomeRangeId: string) {
    return this.http.delete(
      BASE_URL +  `incomeRange/delete?incomeRangeId=${incomeRangeId}`,
    );
  }
}

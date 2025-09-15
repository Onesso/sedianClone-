/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

// Date Format
import { DatePipe } from '@angular/common';

import { jobcategories } from './data';
import { JobCategoriesModel } from './exception.model';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GlobalComponent } from 'src/app/global-component';

const BASE_URL = GlobalComponent.BASE_URL;

interface SearchResult {
  countries: JobCategoriesModel[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  // sortColumn: SortColumn;
  // sortDirection: SortDirection;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  status: string;
  payment: string;
  date: string;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(countries: JobCategoriesModel[]): JobCategoriesModel[] {
  // if (direction === '') {
  return countries;
  // } else {
  //   return [...countries].sort((a, b) => {
  // const res = compare(a[column], b[column]);
  //   return direction === 'asc' ? res : -res;
  // });
  // }
}

function matches(country: JobCategoriesModel, term: string, pipe: PipeTransform) {
  return country.id.toLowerCase().includes(term.toLowerCase())
    || country.name.toLowerCase().includes(term.toLowerCase())
    || country.position.toLowerCase().includes(term.toLowerCase());
}

@Injectable({ providedIn: 'root' })

export class ExceptionService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _countries$ = new BehaviorSubject<JobCategoriesModel[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  content?: any;
  products?: any;

  private _state: State = {
    page: 1,
    pageSize: 16,
    searchTerm: '',
    // sortColumn: '',
    // sortDirection: '',
    startIndex: 0,
    endIndex: 20,
    totalRecords: 0,
    status: '',
    payment: '',
    date: '',
  };

  constructor(
    private pipe: DecimalPipe, 
    private http: HttpClient,
    private datePipe: DatePipe) {

  }



  filterExceptions(riskCode: string, email: string, id: string): Observable<any> {
    const params = {
      riskCode: riskCode, email, id
    }
    return this.http.get<any>(     
      BASE_URL + 'exception/findExceptionById',
      { params }
    );
  }

  findKycByCustomerNo(custNo: string, exceptionCategory: string,groupCode: string) {
    const params = { customerNo: custNo, exceptionCategory: exceptionCategory,groupCode:groupCode};
    return this.http.get(
      BASE_URL + 'exception/findKycByCustomerNo',
      { params }
    );

  }

  clearException(payload: any) {
    return this.http.post<any>(
      BASE_URL + 'exceptionQueue/removeFromQueue',
      payload
    );
  }

  authorizeForAccountCreation(payload: any) {
    return this.http.post<any>(
      BASE_URL + 'exceptionQueue/nextLevel',
      payload
    );
  }


  inviteCustomer(payload: any) {
    return this.http.post<any>(
      BASE_URL + 'exceptionQueue/inviteCustomerToBranch',
      payload
    );
  }


}

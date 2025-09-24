import { DatePipe, DecimalPipe } from "@angular/common";
import { Component, QueryList, ViewChildren } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbPaginationConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";

type DateRange = {
  from: any;
  to: any;
};
@Component({
  selector: "app-customer-ip-address",
  templateUrl: "./customer-ip-address.component.html",
  styleUrl: "./customer-ip-address.component.scss",
})
export class CustomerIpAddressComponent {
  breadCrumbItems!: Array<{}>;
  constructor() {}

  ipaddress: any[] = [];
  loading: boolean = false;
  page: any = 1;
  pageSize: any = 50;
  startIndex: number = 0;
  endIndex: number = 3;
  totalRecords: number = 0;
  currentPage = 1;

  onPageChange(event: any) {
    this.currentPage = event;
    this.getPendingAccounts();
  }

  getPendingAccounts() {
    this.loading = true;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
  }
}

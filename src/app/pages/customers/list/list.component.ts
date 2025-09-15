import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { Observable } from "rxjs";
import { NgbModal, NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormArray,
  Validators,
} from "@angular/forms";
import * as XLSX from "xlsx";

// Date Format
import { DatePipe } from "@angular/common";

import { ListModel } from "./list.model";
import { CustomersService } from "src/app/core/services/customers.service";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { Branch } from "../../system-users/models";
import Swal from "sweetalert2";
import { take } from "rxjs/operators";

type DateRange = {
  from: any;
  to: any;
};

// Add this interface near the top of the file with other interfaces
interface StatusOption {
  label: string;
  value: string;
}

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
  providers: [CustomersService, DecimalPipe],
})

/**
 * List Component
 */
export class ListComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  ordersForm!: UntypedFormGroup;
  CustomersData!: ListModel[];
  masterSelected!: boolean;
  checkedList: any;
  submitted = false;
  searchingById = false;

  // Api Data
  content?: any;
  lists?: any;
  econtent?: any;

  rows: any[] = [];
  originalRows: any[] = [];
  searchObject: string = "";
  startDate: string = "";
  endDate: string = "";
  searchBy: string = "";
  loading: boolean = false;
  searchingCustomer: boolean = false;
  currentPage = 1;
  selectedIndex: number = -1;
  selectedRow: number = 0;
  isNavigatingBack: boolean = false;

  //Pagination SEction
  pageSize: any = 50;
  startIndex: number = 0;
  endIndex: number = 0;
  totalRecords: number = 0;
  searchingByDate: boolean = false;
  selectedStartDate: string = "";
  selectedEndDate: string = "";

  selectedDates: DateRange = {
    from: undefined,
    to: undefined,
  };

  branches: Branch[] = [];

  // Status filtering properties
  selectedStatus: string = "";

  statusOptions: StatusOption[] = [
    { label: "All Status", value: "" },
    { label: "Success", value: "SUCCESS" },
    { label: "In Exception", value: "IN_EXCEPTION" },
    { label: "Incomplete KYC", value: "INCOMPLETE_KYC" },
    { label: "Pending", value: "PND_ACTION" },
    { label: "Invalid ID", value: "INVALID_ID" },
    { label: "Error", value: "ERROR" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Retry", value: "RETRY" },
    { label: "IPRS", value: "IPRS" },
  ];

  private isSearchingById = false;

  constructor(
    private config: NgbPaginationConfig,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private customer: CustomersService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {
    config.maxSize = 5;
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: "Customers" },
      { label: "List", active: true },
    ];

    // Check for navigation from details page
    this.isNavigatingBack =
      sessionStorage.getItem("navigationFromDetails") === "true";

    // Load saved state from URL parameters only once
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      if (this.isNavigatingBack) {
        // When navigating back, preserve all parameters from URL
        this.currentPage = params["page"]
          ? parseInt(params["page"])
          : this.currentPage;
        this.selectedStatus = params["status"] || this.selectedStatus;
        this.searchObject = params["search"] || this.searchObject;
        this.startDate = params["startDate"] || this.startDate;
        this.endDate = params["endDate"] || this.endDate;
      } else {
        // Normal navigation, set default values
        this.currentPage = params["page"] ? parseInt(params["page"]) : 1;
        this.selectedStatus = params["status"] || "";
        this.searchObject = params["search"] || "";
        this.startDate = params["startDate"] || "";
        this.endDate = params["endDate"] || "";
      }

      // Only call getCustomers once
      if (!this.isSearchingById) {
        this.getCustomers();
      }
    });

    // Clean up navigation flag after initialization
    if (this.isNavigatingBack) {
      sessionStorage.removeItem("navigationFromDetails");
    }

    // Load branch data
    this.branches = JSON.parse(sessionStorage.getItem("branches") ?? "[]");
  }

  onStartDateSelect() {
    setTimeout(() => {
      this.startDate = this.formatDate(this.selectedStartDate);
    }, 100);
  }

  onEndDateSelect() {
    setTimeout(() => {
      this.endDate = this.formatDate(this.selectedEndDate);
    }, 100);
  }

  onDateSelect() {
    setTimeout(() => {
      this.startDate = this.formatDate(this.selectedDates.from);
      this.endDate = this.formatDate(this.selectedDates.to);
    }, 500);
  }

  formatDate(date: any) {
    if (!date) return "";
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0");
    var yyyy = date.getFullYear();
    let today = yyyy + "-" + mm + "-" + dd;
    return today;
  }

  getCustomers(): void {
    this.loading = true;
    document.getElementById("elmLoader")?.classList.remove("d-none");

    // If there's an active filter (status), fetch all records
    if (this.selectedStatus) {
      this.customer
        .getCustomers(
          "0", // Start from beginning
          "999999", // Large number to get all records
          this.searchBy,
          this.searchObject,
          this.startDate,
          this.endDate
        )
        .subscribe(
          (resp: any) => {
            document.getElementById("elmLoader")?.classList.add("d-none");
            this.loading = false;

            if (resp.messageCode === "00") {
              // Store all records
              this.originalRows = [...resp.data.info];
              this.totalRecords = resp.recordCount;

              // Apply status filter
              const filteredRows = this.filterRowsByStatus(this.originalRows);
              this.totalRecords = filteredRows.length;

              // Apply pagination to filtered results
              const startIndex = (this.currentPage - 1) * this.pageSize;
              const endIndex = Math.min(
                startIndex + this.pageSize,
                this.totalRecords
              );
              this.rows = filteredRows.slice(startIndex, endIndex);

              // Update pagination display
              this.startIndex = this.totalRecords > 0 ? startIndex + 1 : 0;
              this.endIndex = endIndex;
            } else if (resp.messageCode === "01") {
              this.handleNoData();
            }
          },
          (err: HttpErrorResponse) => {
            this.handleError(err);
          }
        );
    } else {
      // No filter active, use server-side pagination
      const startIndex = ((this.currentPage - 1) * this.pageSize).toString();
      const endIndex = (this.currentPage * this.pageSize).toString();

      this.customer
        .getCustomers(
          startIndex,
          endIndex,
          this.searchBy,
          this.searchObject,
          this.startDate,
          this.endDate
        )
        .subscribe(
          (resp: any) => {
            document.getElementById("elmLoader")?.classList.add("d-none");
            this.loading = false;

            if (resp.messageCode === "00") {
              this.rows = resp.data.info;
              this.originalRows = [...resp.data.info];
              this.totalRecords = parseInt(resp.recordCount);

              // Update pagination display
              this.startIndex =
                this.totalRecords > 0
                  ? (this.currentPage - 1) * this.pageSize + 1
                  : 0;
              this.endIndex = Math.min(
                this.currentPage * this.pageSize,
                this.totalRecords
              );

              // Reset navigation flag after successful data load
              this.isNavigatingBack = false;
            } else if (resp.messageCode === "01") {
              this.handleNoData();
            }
          },
          (err: HttpErrorResponse) => {
            this.handleError(err);
            this.isNavigatingBack = false; // Reset flag on error too
          }
        );
    }
  }

  // Helper method to handle no data response
  private handleNoData(): void {
    this.rows = [];
    this.originalRows = [];
    this.totalRecords = 0;
    this.startIndex = 0;
    this.endIndex = 0;
    this.toastr.info("No records found");
  }

  // Helper method to handle error response
  private handleError(err: HttpErrorResponse): void {
    document.getElementById("elmLoader")?.classList.add("d-none");
    this.loading = false;
    this.toastr.error("Error loading customer data");
    console.error("API Error:", err);
  }

  // Apply status filter to the loaded data
  applyStatusFilter(): void {
    if (!this.selectedStatus) {
      return;
    }

    const filteredRows = this.filterRowsByStatus(this.originalRows);
    this.rows = filteredRows;
    this.totalRecords = filteredRows.length;

    // Adjust pagination display if needed
    this.paginateFilteredData();
  }

  // Helper method to filter rows by selected status
  private filterRowsByStatus(rows: any[]): any[] {
    return rows.filter((row) => {
      switch (this.selectedStatus) {
        case "SUCCESS":
          return row.t24Status === "SUCCESS";
        case "IN_EXCEPTION":
          return (
            row.t24Status === null &&
            row.iprsStatus === "SUCCESS" &&
            row.kycCompleteYN === "Y"
          );
        case "INCOMPLETE_KYC":
          return (
            row.t24Status === null &&
            row.iprsStatus !== "NO DATA FOUND IN IPRS" &&
            row.kycCompleteYN === "N"
          );
        case "IPRS":
          return (
            row.t24Status === null &&
            row.iprsStatus !== "NO DATA FOUND IN IPRS" &&
            row.kycCompleteYN == "N"
          );
        case "PND_ACTION":
          return row.t24Status === "PND_ACTION";
        case "INVALID_ID":
          return (
            row.t24Status === null && row.iprsStatus === "NO DATA FOUND IN IPRS"
          );
        case "ERROR":
          return row.t24Status === "ERROR";
        case "REJECTED":
          return row.t24Status === "REJECTED";
        case "RETRY":
          return row.t24Status === "RETRY";
        default:
          return true;
      }
    });
  }

  // Helper method to paginate filtered data
  private paginateFilteredData(): void {
    // For filtered data, we need to handle pagination manually
    const totalPages = Math.ceil(this.totalRecords / this.pageSize);

    // If current page is beyond available pages, adjust it
    if (
      this.currentPage > totalPages &&
      totalPages > 0 &&
      !this.isNavigatingBack
    ) {
      this.currentPage = totalPages;
      // Update URL with corrected page
      this.updateUrlWithCurrentState();
    }

    // Apply pagination to the filtered data
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);

    // Get the slice of data for current page
    this.rows = this.rows.slice(startIndex, endIndex);
  }

  onPageChange(page: any): void {
    // Ensure page is a number
    const newPage = typeof page === "number" ? page : parseInt(page);

    // Don't proceed if it's the same page
    if (this.currentPage === newPage) {
      return;
    }

    console.log(`Page changing from ${this.currentPage} to ${newPage}`);
    this.currentPage = newPage;

    // If status filter is active and we have all data, just paginate locally
    if (this.selectedStatus && this.originalRows.length > 0) {
      const filteredRows = this.filterRowsByStatus(this.originalRows);
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = Math.min(
        startIndex + this.pageSize,
        filteredRows.length
      );
      this.rows = filteredRows.slice(startIndex, endIndex);

      // Update pagination display
      this.startIndex = filteredRows.length > 0 ? startIndex + 1 : 0;
      this.endIndex = endIndex;
    } else {
      // For non-filtered data, fetch from server
      // Don't reset page when navigating back
      if (!this.isNavigatingBack) {
        this.getCustomers();
      }
    }

    // Update URL without triggering a reload
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...this.route.snapshot.queryParams,
        page: this.currentPage,
      },
      replaceUrl: true,
    });
  }

  viewCustomer(customer: any): void {
    // Navigate to customer details with current state in query params
    const queryParams = {
      page: this.currentPage,
      status: this.selectedStatus,
      search: this.searchObject,
      startDate: this.startDate,
      endDate: this.endDate,
    };

    this.router.navigate(["/app/customers/details", customer.custNo], {
      queryParams,
      replaceUrl: true,
    });
  }

  filterByStatus(): void {
    // Only reset page if not coming back from details and filter changed
    if (!this.isNavigatingBack) {
      this.currentPage = 1;
    }

    // Update URL with current filters
    this.updateUrlWithCurrentState();

    // Refresh data with the new filter
    this.getCustomers();

    // Reset the navigation flag after use
    this.isNavigatingBack = false;
  }

  // Helper method to update URL with current state
  private updateUrlWithCurrentState(): void {
    interface QueryParams {
      page: number;
      status: string | null;
      search: string | null;
      startDate: string | null;
      endDate: string | null;
      [key: string]: string | number | null;
    }

    const queryParams: QueryParams = {
      page: this.currentPage,
      status: this.selectedStatus || null,
      search: this.searchObject || null,
      startDate: this.startDate || null,
      endDate: this.endDate || null,
    };

    // Remove null/undefined values
    Object.keys(queryParams).forEach(
      (key) => queryParams[key] === null && delete queryParams[key]
    );

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: "merge",
      replaceUrl: false,
    });
  }

  confirmIprsRepush(idno: any, index: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "This will make a request to IPRS for the customer data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#364574",
      cancelButtonColor: "rgb(243, 78, 78)",
      confirmButtonText: "Yes, Repush Application",
    }).then((result) => {
      if (result.value) {
        this.repushToIPRS(idno, index);
      }
    });
  }

  getCustomerById(): void {
    if (!this.searchObject || this.searchObject.trim() === "") {
      this.isSearchingById = true; // Set flag to prevent double API call
      this.selectedStatus = "";
      this.searchingCustomer = false;
      this.currentPage = 1;
      this.startDate = "";
      this.endDate = "";

      // Update URL to remove search parameters
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          page: 1, // Keep only the page parameter, reset to 1
        },
        replaceUrl: true,
      });

      // Get all customers
      this.getCustomers();
      this.isSearchingById = false;
      return;
    }

    this.isSearchingById = true; // Set flag before updating URL
    this.selectedStatus = "";
    this.searchingCustomer = true;
    this.currentPage = 1;

    this.updateUrlWithCurrentState();

    document.getElementById("elmLoader")?.classList.remove("d-none");
    this.customer
      .getCustomers(
        "0",
        this.pageSize.toString(),
        "searchObject",
        this.searchObject,
        this.startDate,
        this.endDate
      )
      .subscribe(
        (resp: any) => {
          document.getElementById("elmLoader")?.classList.add("d-none");
          this.searchingCustomer = false;
          this.isSearchingById = false; // Reset flag after API call

          if (resp.messageCode === "00") {
            this.rows = resp.data.info;
            this.originalRows = [...resp.data.info];
            this.totalRecords = parseInt(resp.recordCount);
          } else if (resp.messageCode === "01") {
            this.rows = [];
            this.totalRecords = 0;
            this.startIndex = 0;
            this.endIndex = 0;
            this.toastr.info(resp.message || "No results found");
          }
        },
        (err: HttpErrorResponse) => {
          document.getElementById("elmLoader")?.classList.add("d-none");
          this.searchingCustomer = false;
          this.isSearchingById = false; // Reset flag on error
          this.toastr.error("Error searching for customer");
          console.error("Search Error:", err);
        }
      );
  }

  searchCustomersByDate(): void {
    if (!this.startDate || !this.endDate) {
      this.toastr.warning("Please select both start and end dates");
      return;
    }

    this.selectedStatus = ""; // Reset status filter
    this.searchingByDate = true;
    this.currentPage = 1; // Reset to page 1 when searching by date

    // Update URL with date parameters
    this.updateUrlWithCurrentState();

    document.getElementById("elmLoader")?.classList.remove("d-none");
    this.customer
      .getCustomers(
        "0", // Start index
        this.pageSize.toString(), // End index based on page size
        "date",
        this.searchObject,
        this.startDate,
        this.endDate
      )
      .subscribe(
        (resp: any) => {
          document.getElementById("elmLoader")?.classList.add("d-none");
          this.searchingByDate = false;

          if (resp.messageCode === "00") {
            this.rows = resp.data.info;
            this.originalRows = [...resp.data.info];
            this.totalRecords = parseInt(resp.recordCount);
          } else if (resp.messageCode === "01") {
            this.rows = [];
            this.totalRecords = 0;
            this.startIndex = 0;
            this.endIndex = 0;
            this.toastr.info(
              resp.message || "No results found for the selected date range"
            );
          }
        },
        (err: HttpErrorResponse) => {
          document.getElementById("elmLoader")?.classList.add("d-none");
          this.searchingByDate = false;
          this.toastr.error("Error searching by date");
          console.error("Date Search Error:", err);
        }
      );
  }

  valiadateId(data: any) {
    this.router.navigate(["app/customers/reconcile-id", data.custNo]);
  }

  //Validate Customer KRA
  validateKraPin(val: any, i: any) {
    this.loading = true;
    this.selectedIndex = i;
    this.selectedRow = -1;
    const payload = {
      idNo: val.idNo,
      idType: val.idType,
    };
    this.customer.validateKra(payload).subscribe({
      next: (resp: any) => {
        switch (resp.messageCode) {
          case "00":
            this.loading = false;
            this.toastr.show(resp.message);
            break;
          case "01":
            this.toastr.info(resp.message);
            this.loading = false;
            break;
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err);
      },
    });
  }

  //Repush Failed requests due to IPRS Timeout
  repushToIPRS(idNo: string, i: number) {
    this.loading = true;
    this.selectedRow = i;
    this.selectedIndex = -1;
    const payload = {
      idNo: idNo,
      idType: "NATIONAL_ID",
    };
    this.customer.repushToIPRS(payload).subscribe({
      next: (resp: any) => {
        switch (resp.messageCode) {
          case "00":
            this.toastr.success("Request Sent");
            this.loading = false;
            break;
          case "01":
            this.toastr.info(resp.message);
            this.loading = false;
            break;
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err);
      },
    });
  }

  //Trigger reminder notification to customer
  sendNotification(value: string, i: any) {
    this.loading = true;
    this.selectedRow = i;
    this.selectedIndex = -1;
    this.customer.sendNotification(value).subscribe({
      next: (resp: any) => {
        switch (resp.messageCode) {
          case "00":
            this.toastr.success("Notification Sent");
            this.loading = false;
            break;
          case "01":
            this.toastr.info(resp.message);
            this.loading = false;
            break;
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err);
      },
    });
  }

  exportexcel(): void {
    this.toastr.info("Generating Excel...", "", { timeOut: 1000 });
    const fileName = "Customer List.xlsx";
    /* pass here the table id */
    let element = document.getElementById("customerTable");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, fileName);
  }

  getBranchName(branches: Branch[], code: string) {
    let target = branches.filter((branch) => branch.branchCode === code);
    let targetName = target[0]?.branchName;
    return targetName;
  }
}

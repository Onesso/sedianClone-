import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';

import { JobCategoriesModel } from './exception.model';
import { ExceptionService} from './exception.service';
import { Router } from '@angular/router';
import { jobcategories } from './data';
import { SummaryInfo } from '../dashboards/dashboard/dashboard.model';

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.scss'],
  providers: [DecimalPipe,ExceptionService]
})
export class ExceptionComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  categories: JobCategoriesModel[] = [];
  loading: boolean = false;

  iprsCount: number = 0;
  kraCount: number = 0;
  complianceCount: number = 0;
  t24Count: number = 0;
  childCount: number = 0;
  pepCount: number = 0;


  iprsExcetpion: SummaryInfo;
  kraException: SummaryInfo;
  t24Excetpion: SummaryInfo;
  crrException: SummaryInfo;
  pepExcetpion: SummaryInfo;

  num: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 0,
  };

  constructor(
    public service:  ExceptionService,
    private router: Router
    ) {
      this.categories = jobcategories;

      this.iprsExcetpion = {
        id: 1,
        label: "IPRS",
        labelClass: "muted",
        percentage: 0,
        percentageClass: "success",
        percentageIcon: "ri-arrow-right-up-line",
        counter: 0.0,
        caption: "As of Now",
        icon: "bx bx-stats",
        iconClass: "bg-success-subtle text-success",
        decimals: 1,
        prefix: "",
        suffix: "",
        accountsToday:0,
        opened: 0,
        openedChild:0,
        openedIndiv:0,
        openedJoint:0,
        currentYearTotal: 0
      };
      this.kraException =     {
        id: 2,
        label: "KRA",
        labelClass: "white-50",
        percentage: 0,
        percentageClass: "warning",
        percentageIcon: "ri-arrow-right-down-line",
        counter: 0,
        caption: "View all Accounts",
        icon: "bx bx-user-plus",
        iconClass: "bg-white bg-opacity-25",
        bgColor: "bg-success",
        counterClass: "text-white",
        captionClass: "text-white-50",
        decimals: 1,
        prefix: "",
        suffix: "",
        opened: 0,
        openedChild:0,
        openedIndiv:0,
        openedJoint:0,
        currentYearTotal: 0
    };
  
    this.t24Excetpion = {    
      id: 3,
      label: "T24",
      labelClass: "muted",
      percentage: 0,
      percentageClass: "success",
      percentageIcon: "ri-arrow-right-up-line",
      counter: 0.0,
      caption: "As of Now",
      icon: "bx bx-stats",
      iconClass: "bg-success-subtle text-success",
      decimals: 1,
      prefix: "",
      suffix: "",
      accountsToday:0,
      opened: 0,
      openedChild:0,
      openedIndiv:0,
      openedJoint:0,
      currentYearTotal: 0
  };
  
  this.pepExcetpion = {
    id: 4,
    label: "PEP",
    labelClass: "white-50",
    percentage: 0,
    percentageClass: "warning",
    percentageIcon: "ri-arrow-right-down-line",
    counter: 0,
    caption: "View all Accounts",
    icon: "bx bx-user-plus",
    iconClass: "bg-white bg-opacity-25",
    bgColor: "bg-success",
    counterClass: "text-white",
    captionClass: "text-white-50",
    decimals: 1,
    prefix: "",
    suffix: "",
    opened: 0,
    openedChild:0,
    openedIndiv:0,
    openedJoint:0,
    currentYearTotal: 0
  };

  this.crrException = {
    id: 5,
    label: "Compliance",
    labelClass: "muted",
    percentage: 0,
    percentageClass: "success",
    percentageIcon: "ri-arrow-right-up-line",
    counter: 0,
    caption: "View Accounts",
    icon: "bx bx-user-circle",
    iconClass: "bg-warning-subtle text-warning",
    decimals: 2,
    prefix: "",
    suffix: "",
    openedChild:0,
    openedIndiv:0,
    openedJoint:0,
    currentYearTotal: 0
  };
  }

  ngOnInit(): void {
    /**
  * BreadCrumb
  */
    this.breadCrumbItems = [
      { label: 'Exception' },
      { label: 'Categories', active: true }
    ];

    this.fetchExceptionNo();


  }

  selectCategory(category: string){
    const name = (category).toLowerCase();
    this.router.navigate([`app/exception/${name}`,'authorize']);
  }

  fetchExceptionNo() {
    this.loading = true;
    this.service.filterExceptions('IPRS', "", "").subscribe((resp: any) => {
      switch (resp.messageCode) {
        case '00':
          let allRows = resp.data.info; 
          let rows = allRows.filter((d: any) => d.nextLevellApproval === 'N' || d.nextLevellApproval === '')
          this.iprsCount = rows.length;
          this.iprsExcetpion.count = this.iprsCount;
          break;
        case '01':
          break;
      }
    })

    this.service.filterExceptions("T24", "", "").subscribe(
      (resp: any) => {
        switch (resp.messageCode) {
          case '00':         

            let allRows = resp.data.info; 
            let rows = allRows.filter((d: any) => d.nextLevellApproval === 'N' || d.nextLevellApproval === '')
            this.t24Count = rows.length;
            this.t24Excetpion.count = this.t24Count;
            break;
          case '01':
            break;
        }
      })

    this.service.filterExceptions("PEP", "", "").subscribe(
      (resp: any) => {
        switch (resp.messageCode) {
          case '00':       

            let allRows = resp.data.info; 
            let rows = allRows.filter((d: any) => d.nextLevellApproval === 'N' || d.nextLevellApproval === '')
            this.pepCount = rows.length;
            this.pepExcetpion.count = this.pepCount;
            break;
          case '01':
            break;
        }
      })

    this.service.filterExceptions("CRR", "", "").subscribe(
      (resp: any) => {
        switch (resp.messageCode) {
          case '00':           

            let allRows = resp.data.info; 
            let rows = allRows.filter((d: any) => d.nextLevellApproval === 'N' || d.nextLevellApproval === '')
            this.complianceCount = rows.length;
            this.crrException.count = this.complianceCount;
            break;
          case '01':            
            break;
        }
      })


    this.service.filterExceptions("KRA", "", "").subscribe(
      (resp: any) => {
        switch (resp.messageCode) {         
          case '00':
            this.loading = false;
            let allRows = resp.data.info; 
            let rows = allRows.filter((d: any) => d.nextLevellApproval === 'N' || d.nextLevellApproval === '')
            this.kraCount = rows.length;
            this.kraException.count = this.kraCount;
            break;
          case '01':           
            break;
        }
      })

    }
}

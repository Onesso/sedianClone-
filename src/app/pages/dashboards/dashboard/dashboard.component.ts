import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { EChartsOption, color } from 'echarts';

import { ToastService } from './toast-service';
import { BestSelling, TopSelling, RecentSelling, statData } from './data';
import { ChartType, SummaryInfo } from './dashboard.model';
import { DashboardService } from './dashboard.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DashboardService]
})

/**
 * Ecommerce Component
 */
export class DashboardComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  analyticsChart!: ChartType;
  BestSelling: any;
  TopSelling: any;
  RecentSelling: any;
  SalesCategoryChart!: ChartType;
  statData!: any;
  success_rate: number = 0;

  loading: boolean = false;
  failed_prev: any;
  completed_prev: any;
  failed_current: any;
  completed_current: any;
  percentge_current: any;
  percentge_prev: any;
  percent_self: any;
  percent_agent: any;
  self:any;
  agent:any;
  age1:any;
  age2:any;
  age3:any;
  age4:any;
  percent_age1:any;
  percent_age2:any;
  percent_age3:any;
  percent_age4:any;
  male: any;
  female:any;
  percent_male:any;
  percent_female:any;
  incompleteApplications: any;

  currentPage: any = 1;
  pageSize: any = 200;
  startIndex: number = 0;
  endIndex: number = 200;
  totalRecords: number = 0; 
  completeFlag: string = "";
  startDate: string = "";
  endDate: string = "";
  searchBy: string = "";
  searchObject: string = "";

  kraCounts: number = 0;
  iprsCounts: number = 0;
  complianceCounts: number = 0;
  accCheckCounts: number = 0;
  recogCounts: number = 0;

  rateAnalysis: SummaryInfo;
  individualAccountAnalysys: SummaryInfo;
  jointAccountAnalysys: SummaryInfo;
  yearlyAccountAnalysys : SummaryInfo;

  user: string = '';
  profit: string = '';
  title: string = '';

  chartOption: EChartsOption = {};
  servicesOption: EChartsOption = {};
  ageOption:EChartsOption = {};
  kycOption: EChartsOption = {};

  // Current Date
  currentDate: any;
  constructor(
    public toastService: ToastService,
    private dashboard: DashboardService,
    private toastr: ToastrService
    ) {
    this.user = sessionStorage.getItem('user')!;
    this.rateAnalysis = {
      id: 1,
      label: "Overal Applications",
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
      currentYearTotal:0,
      opened: 0,
      openedChild:0,
      openedIndiv:0,
      openedJoint:0
    };

    this.individualAccountAnalysys =     {
      id: 2,
      label: "Accounts Created",
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
      currentYearTotal:0,
      openedIndiv:0,
      openedJoint:0
  };

  this.yearlyAccountAnalysys = {    
      id: 4,
      label: "YEARLY STATS",
      labelClass: "white-50",
      percentage: 0,
      percentageClass: "warning",
      percentageIcon: "ri-arrow-right-down-line",
      counter: 0,
      caption: "View all Accounts",
      icon: "bx bx-user-plus",
      iconClass: "bg-white bg-opacity-25",
      bgColor: "bg-info",
      counterClass: "text-white",
      captionClass: "text-white-50",
      decimals: 1,
      prefix: "",
      suffix: "",
      openedChild:0,
      currentYearTotal:0,
      openedIndiv:0,
      openedJoint:0,
      currentYear:0,
      previousYear:0
};

this.jointAccountAnalysys = {
  id: 3,
  label: "SUCCESS RATE",
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
  suffix: "%",
  openedChild:0,
  currentYearTotal:0,
  openedIndiv:0,
  openedJoint:0
};
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.currentDate = { from: firstDay, to: lastDay }

    this.chartOption = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '2%',
      },
      series: [
        {
          name: 'Gender',
          type: 'pie',
          radius: ['40%', '80%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          color: [ "#47b2e4", "#f68b08"],
          data: [
            { value: 1048, name: 'Male' },
            { value: 735, name: 'Female' },          
          ]
        }
      ]
    };

 



    this.kycOption = {
      tooltip: {
        trigger: 'item'
      },
      xAxis: {
        type: 'category',
        data: [    
        "OTP(Sent)",
        "OTP(Confirmed)",
        "BackID",
        "FrontId",
        "Preferences",
        "Occupation",
        "Selfie",
        "Completed",
        "Accounts",
        ]
      },
      yAxis: {
        type: 'value'
      },
    
      series: [
      
        {
          color:["#444444"],
          data: [0, 0, 0, 0, 0,0,0,0,0,0],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }
      ]
    };   
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Analytics', active: true }
    ];

    if (localStorage.getItem('toast')) {
      this.toastService.show('Logged in Successfull.', { classname: 'bg-success text-center text-white', delay: 5000 });
      localStorage.removeItem('toast');
    }

    /**
    * Fetches the data
    */
    this.fetchData();
    this.getKyc();
    this.getAccounts();
    this.getTelemetry();
    this.getGraphicalData();
    this.getAge();
    this.getGender();

    // Chart Color Data Get Function
    this._analyticsChart('["--vz-secondary", "--vz-primary", "--vz-primary-rgb, 0.50"]');
    this._SalesCategoryChart('["--vz-primary", "--vz-primary-rgb, 0.85", "--vz-primary-rgb, 0.70", "--vz-primary-rgb, 0.60", "--vz-primary-rgb, 0.45"]');

 

  }


  getKyc() {
    this.loading = true;
    this.dashboard.fetchKyc().subscribe((resp: any) => {
      switch (resp.messageCode) {
        case "00":
          this.loading = false;
          this.failed_prev = resp.data.FailedPrevious;
          this.completed_prev = Math.ceil(resp.data.CompletedPrevious);
          this.percentge_prev =
            (this.completed_prev / (this.failed_prev + this.completed_prev)) *
            100;

          this.failed_current = resp.data.FailedCurrent;
          this.completed_current = resp.data.CompletedCurrent;
          this.percentge_current = Math.ceil(
            (this.completed_current /
              (this.failed_current + this.completed_current)) *
              100
          );
          this.success_rate = this.percentge_current;          
          this.self = resp.data.selfOnboardingCurrent;
          this.agent =   resp.data.agentOnboardingCurrent;
          this.percent_self = Math.ceil(
            (this.self/
              (this.self + this.agent)) *
              100
          );
          this.percent_agent = Math.ceil(100 - this.percent_self);

        
          break;
        case "01":
          this.toastr.info(resp.message);
          this.loading = false;
          break;
      }
    });
  }


  getAccounts() {
    this.loading = true;
    this.dashboard.fetchAccounts().subscribe((resp: any) => {
      switch (resp.messageCode) {
        case "00":
          this.loading = false;
          this.individualAccountAnalysys.counter = resp.data.Individual?.TotalIndividualAccount;
          this.jointAccountAnalysys.counter = resp.data.Joint?.TotalJointAccount;
          this.yearlyAccountAnalysys.counter = resp.data.Child?.TotalChildAccount;
          this.rateAnalysis.accountsToday =  resp.data.DailyAccounts[0]?.total;
          this.rateAnalysis.currentYearTotal = resp.data.Accounts?.TotalAccountCurrentYear;
          this.individualAccountAnalysys.openedIndiv = resp.data.Individual?.openedIndividualAccount;
          this.jointAccountAnalysys.openedJoint = Math.ceil(resp.data.Joint?.OpenedJointAccount);
          this.yearlyAccountAnalysys.openedChild = resp.data.Child?.OpenedChildAccount;
          this.individualAccountAnalysys.percentage =  Math.ceil((this.individualAccountAnalysys.openedIndiv/this.individualAccountAnalysys.counter)*100);
          this.jointAccountAnalysys.percentage= Math.ceil((this.jointAccountAnalysys.openedJoint / this.jointAccountAnalysys.counter)*100);
          break;
        case "01":
          this.toastr.info(resp.message);
          this.loading = false;
          break;
      }
    });
  }

  getTelemetry() {   
    this.loading = true;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.dashboard
      .filterTelemtry(
        startIndex.toString(), endIndex.toString(),this.completeFlag, this.startDate, this.endDate,this.searchBy,this.searchObject
      )
      .subscribe((response: any) => {
        switch (response.messageCode) {
          case "00":
            this.loading = false;
            
            this.rateAnalysis.counter = parseInt(response.recordCount)

            setTimeout(()=>{
              this.incompleteApplications = (this.rateAnalysis.counter - this.individualAccountAnalysys.counter)
            },500)
            this.kycOption = {
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "shadow",
                },
              },

              // title: {
              //   text: "KYC Steps Completion",
              // },
              legend: {
                top: "bottom",
              },
              toolbox: {
                show: true,
                feature: {
                  mark: { show: true },
                  dataView: { show: true, readOnly: false },
                  restore: { show: true },
                  saveAsImage: { show: true },
                },
              },

              xAxis: {
                type: "category",
                data: [
                  "OTP(Sent)",
                  "OTP(Confirmed)",
                  "BackID",
                  "FrontId",
                  "Preferences",
                  "Occupation",
                  "Selfie",
                  "Completed",
                  "Accounts",               
                ],
              },
              yAxis: {
                type: "value",
              },
              color: ["#ffca5b"],
              series: [
                {
                  data: [
                    response.data.summary.SentOTP,
                    response.data.summary.ConfirmedOTP,
                    response.data.summary.BackId,
                    response.data.summary.FrontId,
                    response.data.summary.Preference,
                    response.data.summary.occupation,
                    response.data.summary.Selfies,
                    response.data.summary.CompleteKYC,
                    response.data.summary.NumberAccounts,
                    
                  ],
                  type: "bar",
                  showBackground: true,
                  backgroundStyle: {
                    color: "rgba(180, 180, 180, 0.2)",
                  },
                },
              ],
            };

            this.chartOption = Object.assign({}, this.chartOption);
            break;
          case "01":
            this.toastr.info(response.message);
            this.loading = false;
            break;
        }
      });
  }

  getGraphicalData() {
    this.dashboard.fetchGraphicalData().subscribe((resp: any) => {
      switch (resp.messageCode) {
        case "00":
          this.kraCounts = resp.data.info.kra.success;
          this.iprsCounts = resp.data.info.iprs.success;
          this.complianceCounts = resp.data.info.compliance.success;
          this.accCheckCounts =resp.data.info.account_check.success;
          this.recogCounts = resp.data.info.recognition.success;
          this.servicesOption = {
            tooltip: {
              trigger: 'item'
            },
            xAxis: {
              type: 'category',
              data: ['Acc. Check','KRA', 'IPRS', 'Compliance',"Recognition"]
            },
            yAxis: {
              type: 'value'
            },
          
            series: [
            
              {
                color:["#ffca5b"],
                data: [    
                  resp.data.info.account_check.success,
                  resp.data.info.kra.success, 
                  resp.data.info.iprs.success,     
                  resp.data.info.compliance.success,                                        
                  resp.data.info.recognition.success,
                ],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                  color: "rgba(180, 180, 180, 0.2)",
                }
              }
            ]
          };

          break;
        case "01":
          this.toastr.info(resp.message);
          this.loading = false;
          break;
      }
    });
  }

  getAge() {
    this.dashboard.fetchAge().subscribe((resp: any) => {
      let ages = [];
      for (const age in resp.data) {
        ages.push({ name: age, value: resp.data[age] });
      }

      this.ageOption = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Age',
            type: 'pie',
            radius: ['40%', '80%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            color: ["#D22E2E", "#ffca5b", "#012032", "#47b2e4"],
            data: ages,
          },
          this.age1 = ages[1].value,
          this.age2 = ages[0].value,
          this.age3 = ages[2].value,
          this.age4 = ages[3].value,
          this.percent_age1 = Math.ceil(
            (this.age1/
              (this.age1 + this.age2 + this.age3 + this.age4)) *
              100
          ),
          this.percent_age2 = Math.ceil(
            (this.age2/
              (this.age1 + this.age2 + this.age3 + this.age4)) *
              100
          ),
          this.percent_age3 = Math.ceil(
            (this.age3/
              (this.age1 + this.age2 + this.age3 + this.age4)) *
              100
          ),
          this.percent_age4 = Math.ceil(
            (this.age4/
              (this.age1 + this.age2 + this.age3 + this.age4)) *
              100
          ),
        ]
      };
      // this.ageOption = {
      //   legend: {
      //     top: "bottom",
      //   },
      //   toolbox: {
      //     show: true,
      //     feature: {
      //       mark: { show: true },
      //       dataView: { show: true, readOnly: false },
      //       restore: { show: true },
      //       saveAsImage: { show: true },
      //     },
      //   },
      //   color: ["#D22E2E", "#378D3B", "#F47B00", "#0f3780"],
      //   series: [
      //     {
      //       name: "Age Chart",
      //       type: "pie",
      //       radius: ["40%", "80%"],
      //       avoidLabelOverlap: true,
      //       itemStyle: {
      //         borderRadius: 10,
      //         borderColor: "#fff",
      //         borderWidth: 2,
      //       },
      //       label: {
      //         show: false,
      //         position: "center",
      //       },
      //       emphasis: {
      //         label: {
      //           show: true,
      //           fontSize: "20",
      //           fontWeight: "bold",
      //         },
      //       },
      //       labelLine: {
      //         show: false,
      //       },
      //       data: ages,

      //     },

      //     this.age1 = ages[1].value,
      //     this.age2 = ages[0].value,
      //     this.age3 = ages[2].value,
      //     this.age4 = ages[3].value,
      //     this.percent_age1 = Math.ceil(
      //       (this.age1/
      //         (this.age1 + this.age2 + this.age3 + this.age4)) *
      //         100
      //     ),
      //     this.percent_age2 = Math.ceil(
      //       (this.age2/
      //         (this.age1 + this.age2 + this.age3 + this.age4)) *
      //         100
      //     ),
      //     this.percent_age3 = Math.ceil(
      //       (this.age3/
      //         (this.age1 + this.age2 + this.age3 + this.age4)) *
      //         100
      //     ),
      //     this.percent_age4 = Math.ceil(
      //       (this.age4/
      //         (this.age1 + this.age2 + this.age3 + this.age4)) *
      //         100
      //     ),
      //   ],
      // };
    });
  }

  getGender() {
    this.loading = true;
    this.dashboard.fetchGender().subscribe((resp: any) => {
      switch (resp.messageCode) {
        case "00":
          this.loading = false;
          let genders = [];
          for (const gender in resp.data) {
            genders.push({ name: gender, value: resp.data[gender] });
          }
          this.chartOption= {
            tooltip: {
              trigger: 'item'
            },
            legend: {
              top: "bottom",
            },
            toolbox: {
              show: true,
              feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true },
              },
            },
            color: [ "#47b2e4", "#ffca5b"],
            series: [
              {
                name: "Gender",
                type: "pie",
                radius: ["40%", "80%"],
                avoidLabelOverlap: true,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: "#fff",
                  borderWidth: 2,
                },
                label: {
                  show: false,
                  position: "center",
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: "20",
                    fontWeight: "bold",
                  },
                },
                labelLine: {
                  show: true,
                },
                data: genders,

              },
              this.male = genders[0].value,
              this.female = genders[1].value,
              this.percent_male = Math.ceil(
                (this.male/
                  (this.male + this.female)) * 100
              ),
              this.percent_female = Math.ceil(
                (this.female/
                  (this.male + this.female)) * 100
              ),

            ],
          };
          break;
        case "01":
          this.toastr.info(resp.message);
          this.loading = false;
          break;
      }
    });
  }

  // Chart Colors Set
  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
        if (color) {
          color = color.replace(" ", "");
          return color;
        }
        else return newValue;
      } else {
        var val = value.split(',');
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
          rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }

  /**
 * Sales Analytics Chart
 */
  setrevenuevalue(value: any) {
    if (value == 'all') {
      this.analyticsChart.series = [{
        name: 'Orders',
        type: 'area',
        data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67]
      }, {
        name: 'Earnings',
        type: 'bar',
        data: [89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36, 88.51, 36.57]
      }, {
        name: 'Refunds',
        type: 'line',
        data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35]
      }]
    }
    if (value == '1M') {
      this.analyticsChart.series = [{
        name: 'Orders',
        type: 'area',
        data: [24, 75, 16, 98, 19, 41, 52, 34, 28, 52, 63, 67]
      }, {
        name: 'Earnings',
        type: 'bar',
        data: [99.25, 28.58, 98.74, 12.87, 107.54, 94.03, 11.24, 48.57, 22.57, 42.36, 88.51, 36.57]
      }, {
        name: 'Refunds',
        type: 'line',
        data: [28, 22, 17, 27, 21, 11, 5, 9, 17, 29, 12, 15]
      }]
    }
    if (value == '6M') {
      this.analyticsChart.series = [{
        name: 'Orders',
        type: 'area',
        data: [34, 75, 66, 78, 29, 41, 32, 44, 58, 52, 43, 77]
      }, {
        name: 'Earnings',
        type: 'bar',
        data: [109.25, 48.58, 38.74, 57.87, 77.54, 84.03, 31.24, 18.57, 92.57, 42.36, 48.51, 56.57]
      }, {
        name: 'Refunds',
        type: 'line',
        data: [12, 22, 17, 27, 1, 51, 5, 9, 7, 29, 12, 35]
      }]
    }
    if (value == '1Y') {
      this.analyticsChart.series = [{
        name: 'Orders',
        type: 'area',
        data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67]
      }, {
        name: 'Earnings',
        type: 'bar',
        data: [89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36, 88.51, 36.57]
      }, {
        name: 'Refunds',
        type: 'line',
        data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35]
      }]
    }
  }

  private _analyticsChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.analyticsChart = {
      chart: {
        height: 370,
        type: "line",
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: "straight",
        dashArray: [0, 0, 8],
        width: [2, 0, 2.2],
      },
      colors: colors,
      series: [{
        name: 'Orders',
        type: 'area',
        data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67]
      }, {
        name: 'Earnings',
        type: 'bar',
        data: [89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36,
          88.51, 36.57]
      }, {
        name: 'Refunds',
        type: 'line',
        data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35]
      }],
      fill: {
        opacity: [0.1, 0.9, 1],
      },
      labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003', '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'],
      markers: {
        size: [0, 0, 0],
        strokeWidth: 2,
        hover: {
          size: 4,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
        padding: {
          top: 0,
          right: -2,
          bottom: 15,
          left: 10,
        },
      },
      legend: {
        show: true,
        horizontalAlign: "center",
        offsetX: 0,
        offsetY: -5,
        markers: {
          width: 9,
          height: 9,
          radius: 6,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 0,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "30%",
          barHeight: "70%",
        },
      },
    };
  }

  /**
 *  Sales Category
 */
  private _SalesCategoryChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.SalesCategoryChart = {
      series: [44, 55, 41, 17, 15],
      labels: ["Direct", "Social", "Email", "Other", "Referrals"],
      chart: {
        height: 333,
        type: "donut",
      },
      legend: {
        position: "bottom",
      },
      stroke: {
        show: false
      },
      dataLabels: {
        dropShadow: {
          enabled: false,
        },
      },
      colors: colors
    };
  }

  /**
  * Fetches the data
  */
  private fetchData() {
    this.BestSelling = BestSelling;
    this.TopSelling = TopSelling;
    this.RecentSelling = RecentSelling;
    this.statData = statData;
  }

 

  num: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 0,
  };

  /**
  * Swiper Vertical  
   */
  Vertical = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 2 ,
    slidesToScroll: 1,
    arrows: false,
    vertical: true // Enable vertical sliding
  };
  /**
   * Recent Activity
   */
  toggleActivity() {
    const recentActivity = document.querySelector('.layout-rightside-col');
    if (recentActivity != null) {
      recentActivity.classList.toggle('d-none');
    }

    if (document.documentElement.clientWidth <= 767) {
      const recentActivity = document.querySelector('.layout-rightside-col');
      if (recentActivity != null) {
        recentActivity.classList.add('d-block');
        recentActivity.classList.remove('d-none');
      }
    }
  }

  /**
   * SidebarHide modal
   * @param content modal content
   */
  SidebarHide() {
    const recentActivity = document.querySelector('.layout-rightside-col');
    if (recentActivity != null) {
      recentActivity.classList.remove('d-block');
    }
  }

}

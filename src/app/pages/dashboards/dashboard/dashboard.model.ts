// Chart data
export interface ChartType {
    chart?: any;
    plotOptions?: any;
    colors?: any;
    series?: any;
    fill?: any;
    dataLabels?: any;
    legend?: any;
    xaxis?: any;
    stroke?: any;
    labels?: any;
    markers?: any;
    yaxis?: any;
    tooltip?: any;
    grid?: any;
    title?: any;
    responsive?: any;
}

export interface SummaryInfo{  
        id: any;
        label: string;
        labelClass: string;
        percentage: number;
        percentageClass?: string;
        percentageIcon?: string;
        counter?: any;
        caption?: string;
        icon?: any;
        iconClass?:string;
        decimals?: number;
        prefix?: string;
        suffix?: string;
        bgColor?:string;
        captionClass?:string;
        counterClass?:string;
        opened?:number;
        accountsToday?:any;
        currentYearTotal:number;
        openedChild:number;
        openedIndiv:number;
        openedJoint:number;
        count?:number;
        currentYear?:0,
        previousYear?:0
  
}
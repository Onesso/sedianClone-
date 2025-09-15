export interface SystemUser {
    userId: string;
    username?: String;
    phoneNO?: String;
    email?: String;
    otherNames?: String;
    surname?: String;
    branchCode?: String;
    departmentCode?: String;
    salesCode?: String;
    userGroup?: any;
    token?: String;
    userInfo?: any;
    accessInfo?: any;
    sales_group: string;
    message?: any;
    access_group?: any
    alertType?: any;

}

export interface Branch {
    _id: string;
    branchCode: string;
    branchName: string;
}

export interface Affiliate {
    affiliateId: string;
    email: string;
    phone: string;
    urlLink: string;
    businessModel: string;
    platform?: string;
    alias?: string;
    firstName: string;
    lastName: string;
    code: string;
}
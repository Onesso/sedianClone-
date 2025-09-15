import { MenuItem } from "./menu.model";

export const DASHBOARD_MENU: MenuItem[] = [
  {
    id: 1,
    label: "DASHBOARD",
    isTitle: true,
  },

  //Dashboard Menu
  {
    id: 2,
    label: "Dashboard",
    icon: "ri-dashboard-2-line",
    subItems: [
      {
        id: 3,
        label: "Analytics",
        link: "/app/analytics",
        parentId: 2,
      },
    ],
  },

  //Application Status Menu
  {
    id: 200,
    label: "Application Status",
    icon: "ri-apps-line",
    subItems: [
      {
        id: 201,
        label: "Application Status",
        link: "/app/application-status/individual-applications",
        parentId: 200,
      },
      {
        id: 202,
        label: "Integration Status",
        link: "/app/application-status/integration-status",
        parentId: 200,
      },
    ],
  },

  //Customer Menu
  {
    id: 3,
    label: "Customers",
    icon: "ri-apps-2-line",
    subItems: [
      {
        id: 6,
        label: "Customer List",
        link: "/app/customers/list",
        parentId: 3,
      },
    ],
  },

  //Accounts Menu
  {
    id: 4,
    label: "Accounts",
    icon: "ri-briefcase-line",
    subItems: [
      {
        id: 7,
        label: "Created Accounts",
        link: "/app/accounts/list",
        parentId: 4,
      },
      {
        id: 11,
        label: "Pending Accounts",
        link: "/app/accounts/pending-accounts",
        parentId: 4,
        // badge: {
        //   variant: "badge rounded-pill bg-warning",
        //   text: "34"
        // },
      },
    ],
  },

  //Exception Menu
  {
    id: 5,
    label: "Exceptions",
    icon: "ri-command-fill",
    subItems: [
      {
        id: 8,
        label: "Application Exceptions",
        link: "/app/exception",
        parentId: 5,
      },
    ],
  },
];

export const REPORTS_MENU: MenuItem[] = [
  {
    id: 2,
    label: "REPORTS",
    isTitle: true,
  },
  {
    id: 8,
    label: "Reports",
    icon: "ri-command-fill",
    subItems: [
      {
        id: 4,
        label: "Kra Logs",
        link: "/app/reports/kra-logs",
        parentId: 2,
      },
      {
        id: 5,
        label: "Iprs Logs",
        link: "/app/reports/iprs-logs",
        parentId: 2,
      },
      {
        id: 212,
        label: "Approved Exceptions",
        link: "/app/reports/approved-exceptions",
        parentId: 2,
      },
      {
        id: 213,
        label: "Rejected Exceptions",
        link: "/app/reports/rejected-exceptions",
        parentId: 2,
      },
      {
        id: 214,
        label: "Drop Off",
        link: "/app/reports/drop-off",
        parentId: 2,
      },
    ],
  },
  {
    id: 10,
    label: "Documents Archived",
    icon: "ri-contacts-book-upload-line",
    link: "/app/reports/documents-archived",
    parentId: 8,
  },
];
export const SETTINGS_MENU: MenuItem[] = [
  {
    id: 2,
    label: "SETTINGS",
    isTitle: true,
  },
  {
    id: 6,
    label: "Product Setup",
    icon: " ri-archive-line",
    subItems: [
      {
        id: 9,
        label: "Account Type",
        link: "/app/product-setup/account-type",
        parentId: 6,
      },
      {
        id: 10,
        label: "Product Type Setup",
        link: "/app/product-setup/product-type",
        parentId: 6,
      },
      {
        id: 11,
        label: "Pending Product Types",
        link: "/app/product-setup/pending-product-types",
        parentId: 6,
        badge: {
          variant: "badge rounded-pill bg-warning",
          text: "34",
        },
      },
      {
        id: 12,
        label: " Products Bundle",
        link: "/app/product-setup/bundle-products",
        parentId: 6,
      },
      {
        id: 13,
        label: "Parent Account",
        link: "/app/product-setup/parent-account",
        parentId: 6,
      },
    ],
  },
  {
    id: 21,
    label: "System Users",
    icon: "ri-user-settings-line",
    subItems: [
      {
        id: 20,
        label: "Users",
        link: "/app/system-users/all",
        parentId: 21,
      },
      {
        id: 21,
        label: "Roles",
        link: "/app/system-users/roles",
        parentId: 21,
      },
    ],
  },
  {
    id: 7,
    label: "Custom Settings",
    icon: "ri-tools-fill",
    subItems: [
      {
        id: 13,
        label: "Countries",
        link: "/app/settings/countries",
        parentId: 7,
      },
      {
        id: 14,
        label: "Branches",
        link: "/app/settings/branches",
        parentId: 7,
      },
      {
        id: 15,
        label: "Currency",
        link: "/app/settings/currencies",
        parentId: 7,
      },
      {
        id: 20,
        label: "Occupation Sectors",
        link: "/app/settings/industry-sectors",
        parentId: 7,
      },
      {
        id: 16,
        label: "Employers",
        link: "/app/settings/employers",
        parentId: 7,
      },
      {
        id: 17,
        label: "Income Ranges",
        link: "/app/settings/income-ranges",
        parentId: 7,
      },
      {
        id: 18,
        label: "Rejection Type",
        link: "/app/settings/rejection-types",
        parentId: 7,
      },
      {
        id: 19,
        label: "Messages",
        link: "/app/settings/messages",
        parentId: 7,
      },
    ],
  },
];

export const MARKETING_MENU: MenuItem[] = [
  {
    id: 2,
    label: "MARKETING TOOLS",
    isTitle: true,
  },

  {
    id: 22,
    label: "Affiliates",
    icon: "ri-user-settings-line",
    subItems: [
      {
        id: 20,
        label: "Affiliate Users",
        link: "/app/system-users/affiliates",
        parentId: 22,
      },
    ],
  },
];

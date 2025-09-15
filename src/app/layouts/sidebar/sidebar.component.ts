import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import {
  DASHBOARD_MENU,
  REPORTS_MENU,
  SETTINGS_MENU,
  MARKETING_MENU,
} from "./menu";
import { MenuItem } from "./menu.model";
import { ProductSetupService } from "src/app/pages/product-setup/product-setup.service";
import { PermissionsService } from "../../core/services/permissions.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
  providers: [ProductSetupService],
})
export class SidebarComponent implements OnInit {
  menu: any;
  toggle: any = true;
  menuItems: MenuItem[] = [];
  pending: any[] = [];
  @ViewChild("sideMenu") sideMenu!: ElementRef;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  isUserPeleza: boolean = false;
  isUserSbgs: boolean = false;
  allowDashboard: boolean = false;
  allowReports: boolean = false;
  allowSettings: boolean = false;
  allowMarketing: boolean = false;
  userGroup: any;

  constructor(
    private router: Router,
    private auth: PermissionsService,
    private productService: ProductSetupService,
    public translate: TranslateService
  ) {
    translate.setDefaultLang("en");
    // const userRole = JSON.parse(sessionStorage.getItem('roles') ?? '');
    // this.userGroup = JSON.parse(sessionStorage.getItem('userGroup') ?? '');
  }

  ngOnInit(): void {
    // Menu Items
    this.router.events.subscribe((event) => {
      if (document.documentElement.getAttribute("data-layout") != "twocolumn") {
        if (event instanceof NavigationEnd) {
          this.initActiveMenu();
        }
      }
    });
    // this.fetchAccountSetup();

    setTimeout(() => {
      this.allowDashboard = this.viewDashboard();
      this.allowReports = this.viewReports();
      this.allowSettings = this.viewSettings();
      this.allowMarketing = this.viewMarketing();

      if (this.allowDashboard)
        this.menuItems = this.menuItems.concat(DASHBOARD_MENU);
      if (this.allowReports)
        this.menuItems = this.menuItems.concat(REPORTS_MENU);
      if (this.allowSettings)
        this.menuItems = this.menuItems.concat(SETTINGS_MENU);
      if (this.allowMarketing)
        this.menuItems = this.menuItems.concat(MARKETING_MENU);
    }, 200);
  }

  /***
   * Activate droup down set
   */
  ngAfterViewInit() {
    setTimeout(() => {
      this.initActiveMenu();
    }, 0);
  }

  viewDashboard(): boolean {
    // return this.auth.isPermissionAllowed('DashboardMenu','Read');
    return true;
  }

  viewReports(): boolean {
    // return this.auth.isPermissionAllowed("ReportsMenu", "Read");
    return true;
  }

  viewSettings(): boolean {
    // return this.auth.isPermissionAllowed("SettingsMenu", "Read");
    return true;
  }

  viewMarketing(): boolean {
    // return this.auth.isPermissionAllowed("MarketingMenu", "Read");
    return true;
  }

  fetchAccountSetup() {
    this.productService.fetchAccountSetupList().subscribe((resp: any) => {
      let rows = resp.data.info;
      let approv = "N";
      this.pending = rows.filter(
        (pend: any) => pend.approved === approv
      ).length;
    });
  }

  removeActivation(items: any) {
    items.forEach((item: any) => {
      if (item.classList.contains("menu-link")) {
        if (!item.classList.contains("active")) {
          item.setAttribute("aria-expanded", false);
        }
        item.nextElementSibling
          ? item.nextElementSibling.classList.remove("show")
          : null;
      }
      if (item.classList.contains("nav-link")) {
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove("show");
        }
        item.setAttribute("aria-expanded", false);
      }
      item.classList.remove("active");
    });
  }

  toggleSubItem(event: any) {
    let isCurrentMenuId = event.target.closest("a.nav-link");
    let isMenu = isCurrentMenuId.nextElementSibling as any;
    if (isMenu.classList.contains("show")) {
      isMenu.classList.remove("show");
      isCurrentMenuId.setAttribute("aria-expanded", "false");
    } else {
      let dropDowns = Array.from(document.querySelectorAll(".sub-menu"));
      dropDowns.forEach((node: any) => {
        node.classList.remove("show");
      });

      let subDropDowns = Array.from(
        document.querySelectorAll(".menu-dropdown .nav-link")
      );
      subDropDowns.forEach((submenu: any) => {
        submenu.setAttribute("aria-expanded", "false");
      });

      if (event.target && event.target.nextElementSibling) {
        isCurrentMenuId.setAttribute("aria-expanded", "true");
        event.target.nextElementSibling.classList.toggle("show");
      }
    }
  }

  toggleExtraSubItem(event: any) {
    let isCurrentMenuId = event.target.closest("a.nav-link");
    let isMenu = isCurrentMenuId.nextElementSibling as any;
    if (isMenu.classList.contains("show")) {
      isMenu.classList.remove("show");
      isCurrentMenuId.setAttribute("aria-expanded", "false");
    } else {
      let dropDowns = Array.from(document.querySelectorAll(".extra-sub-menu"));
      dropDowns.forEach((node: any) => {
        node.classList.remove("show");
      });

      let subDropDowns = Array.from(
        document.querySelectorAll(".menu-dropdown .nav-link")
      );
      subDropDowns.forEach((submenu: any) => {
        submenu.setAttribute("aria-expanded", "false");
      });

      if (event.target && event.target.nextElementSibling) {
        isCurrentMenuId.setAttribute("aria-expanded", "true");
        event.target.nextElementSibling.classList.toggle("show");
      }
    }
  }

  // Click wise Parent active class add
  toggleParentItem(event: any) {
    let isCurrentMenuId = event.target.closest("a.nav-link");
    let dropDowns = Array.from(document.querySelectorAll("#navbar-nav .show"));
    dropDowns.forEach((node: any) => {
      node.classList.remove("show");
    });
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const iconItems = Array.from(ul.getElementsByTagName("a"));
      let activeIconItems = iconItems.filter((x: any) =>
        x.classList.contains("active")
      );
      activeIconItems.forEach((item: any) => {
        item.setAttribute("aria-expanded", "false");
        item.classList.remove("active");
      });
    }
    isCurrentMenuId.setAttribute("aria-expanded", "true");
    if (isCurrentMenuId) {
      this.activateParentDropdown(isCurrentMenuId);
    }
  }

  toggleItem(event: any) {
    let isCurrentMenuId = event.target.closest("a.nav-link");
    let isMenu = isCurrentMenuId.nextElementSibling as any;
    if (isMenu.classList.contains("show")) {
      isMenu.classList.remove("show");
      isCurrentMenuId.setAttribute("aria-expanded", "false");
    } else {
      let dropDowns = Array.from(
        document.querySelectorAll("#navbar-nav .show")
      );
      dropDowns.forEach((node: any) => {
        node.classList.remove("show");
      });
      isMenu ? isMenu.classList.add("show") : null;
      const ul = document.getElementById("navbar-nav");
      if (ul) {
        const iconItems = Array.from(ul.getElementsByTagName("a"));
        let activeIconItems = iconItems.filter((x: any) =>
          x.classList.contains("active")
        );
        activeIconItems.forEach((item: any) => {
          item.setAttribute("aria-expanded", "false");
          item.classList.remove("active");
        });
      }
      isCurrentMenuId.setAttribute("aria-expanded", "true");
      if (isCurrentMenuId) {
        this.activateParentDropdown(isCurrentMenuId);
      }
    }
  }

  activateParentDropdown(item: any) {
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

    if (parentCollapseDiv) {
      // to set aria expand true remaining
      parentCollapseDiv.classList.add("show");
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      parentCollapseDiv.parentElement.children[0].setAttribute(
        "aria-expanded",
        "true"
      );
      if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
        parentCollapseDiv.parentElement
          .closest(".collapse")
          .classList.add("show");
        if (
          parentCollapseDiv.parentElement.closest(".collapse")
            .previousElementSibling
        )
          parentCollapseDiv.parentElement
            .closest(".collapse")
            .previousElementSibling.classList.add("active");
        if (
          parentCollapseDiv.parentElement
            .closest(".collapse")
            .previousElementSibling.closest(".collapse")
        ) {
          parentCollapseDiv.parentElement
            .closest(".collapse")
            .previousElementSibling.closest(".collapse")
            .classList.add("show");
          parentCollapseDiv.parentElement
            .closest(".collapse")
            .previousElementSibling.closest(".collapse")
            .previousElementSibling.classList.add("active");
        }
      }
      return false;
    }
    return false;
  }

  updateActive(event: any) {
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      this.removeActivation(items);
    }
    this.activateParentDropdown(event.target);
  }

  initActiveMenu() {
    const pathName = window.location.pathname;
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      let activeItems = items.filter((x: any) =>
        x.classList.contains("active")
      );
      this.removeActivation(activeItems);

      let matchingMenuItem = items.find((x: any) => {
        return x.pathname === pathName;
      });
      if (matchingMenuItem) {
        this.activateParentDropdown(matchingMenuItem);
      }
    }
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    var sidebarsize =
      document.documentElement.getAttribute("data-sidebar-size");
    if (sidebarsize == "sm-hover-active") {
      document.documentElement.setAttribute("data-sidebar-size", "sm-hover");
    } else {
      document.documentElement.setAttribute(
        "data-sidebar-size",
        "sm-hover-active"
      );
    }
  }

  /**
   * SidebarHide modal
   * @param content modal content
   */
  SidebarHide() {
    document.body.classList.remove("vertical-sidebar-enable");
  }
}

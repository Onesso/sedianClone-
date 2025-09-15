import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { interval, map } from 'rxjs';
import { AccountsService } from 'src/app/core/services/accounts.service';
import { AccountsListService } from '../accounts-list.service';
import { GlobalComponent } from 'src/app/global-component';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
  providers: [AccountsListService, AccountsService, DecimalPipe]
})
export class AccountDetailsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  tag: string = 'Y';

  data: any[] = [];
  loading = false;

  imageUrl = GlobalComponent.IMAGE_URL;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    public service: AccountsListService,
    private accounts: AccountsService,
  ) { }

  ngOnInit(): void {
 
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Accounts' },
      { label: 'Account Details', active: true }
    ];

    this.fetchAccount();
  }

  back(): void {
    switch (this.tag) {
      case 'Y':
        this.router.navigate(['/app/accounts/list']);
        break;

      case 'N':
        this.router.navigate(['app/accounts/pending-accounts']);
        break;

      default:
        break;
    }
   
  }
 
  fetchAccount(){
    this.loading = true;
    this.route.params.subscribe((params: any) => {
      let id = params['id'];  
      this.tag = params['tag'];  
      this.service.getAccountMembers(id).subscribe((resp: any) => {
        switch (resp.messageCode) {
          case '00':
            this.data = resp.data.info  
            this.data.forEach(cust => {  
              cust.photoImage = `${this.imageUrl}${cust.photoImage}`;  
            });
            this.loading = false
            break;
          case '01':
            this.toastr.info(resp.message)
            this.loading = false
            break;
        }
  
      });
    })
  }

}

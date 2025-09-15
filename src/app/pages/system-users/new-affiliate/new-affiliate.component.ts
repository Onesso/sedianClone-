import { Component } from '@angular/core';
import { UsersService } from '../users.service';
import { ToastrService } from 'ngx-toastr';
// import { Branch } from '../models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-affiliate',
  templateUrl: './new-affiliate.component.html',
  styleUrls: ['./new-affiliate.component.scss']
})
export class NewAffiliateComponent {
  breadCrumbItems!: Array<{}>;
  loading: boolean = false;
  userForm: FormGroup;

  // roleList: any[] = [];
  // branchList : Branch[] = [];

  constructor(
    private service: UsersService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,

  ) { 
    this.userForm = this.fb.group({      
      email: ["", Validators.required],       
      phone: ["", Validators.required],
      urlLink: [""],
      businessModel: ["", Validators.required],      
      platform: [[], Validators.required],
      alias: [""],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
    });
  }

  ngOnInit(): void {    
     this.breadCrumbItems = [
      { label: 'Affiliates' },
      { label: 'New Affiliate', active: true }
    ];

  }

  saveUser(){
    this.loading = true;
    const formData = this.userForm.value;

    this.service.addAffiliate(formData).subscribe({
      next: (resp: any) => {
        switch (resp.messageCode) {
          case "00":
            this.loading = false;
            this.toastr.success(resp.message);
            this.router.navigateByUrl("/app/system-users/affiliates");
            break;
          case "01":
            this.loading = false;
            this.toastr.error(resp.message);
            break;
        }
      },

      error: (error) =>{
        this.loading = false;
        this.toastr.error('An error occured' ,error);
      }
    });
  }
}

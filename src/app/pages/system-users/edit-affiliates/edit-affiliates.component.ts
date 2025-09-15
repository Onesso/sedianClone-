import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../users.service';
import { Affiliate } from 'src/app/core/models/types';

@Component({
  selector: 'app-edit-affiliates',
  templateUrl: './edit-affiliates.component.html',
  styleUrls: ['./edit-affiliates.component.scss']
})
export class EditAffiliatesComponent {
  breadCrumbItems!: Array<{}>;
loading: boolean = false;
userForm: FormGroup;

affiliateId: string = "";
selectedAffiliate: Affiliate = {};

constructor(
  private service: UsersService,
  private toastr: ToastrService,
  private fb: FormBuilder,
  private router: Router,
  private route: ActivatedRoute

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
    { label: 'Edit Affiliates', active: true }
  ];

  this.service.getAffiliateValue().subscribe((affiliate: Affiliate) => {   
    this.selectedAffiliate = affiliate;
    this.userForm.patchValue(
     { 
      email: affiliate.email,
      phone: affiliate.phone,
      urlLink: affiliate.urlLink,
      businessModel: affiliate.businessModel,
      platform: affiliate.platform,
      alias: affiliate.alias,
      firstName: affiliate.firstName,
      lastName: affiliate.lastName,
    }
    );
  });

  }


updateAffiliate(){
  this.loading = true;
  const formData = this.userForm.value;
  const payload = {
    email: formData.email,
    phone: formData.phone,
    urlLink: formData.urlLink,
    businessModel: formData.businessModel,
    platform: formData.platform,
    alias: formData.alias,
    firstName: formData.firstName,
    lastName: formData.lastName,
  };
  this.service.updateAffiliate(payload, this.affiliateId).subscribe({
    next: (resp: any) => {
      switch (resp.messageCode) {
        case "00":
          this.loading = false;
          this.service.addAffiliate(payload);
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
      this.toastr.error(error);
    }
  });
}
}

import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";

import { AuthenticationService } from "../../core/services/auth.service";
import { ToastrService } from "ngx-toastr";
import { PermissionsService } from "../../core/services/permissions.service";
import { set } from "lodash";

@Component({
  selector: "app-cover",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})

/**
 * Cover Component
 */
export class LoginComponent implements OnInit {
  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = "";
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;

  isLoading: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private auth: PermissionsService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      password: ["", Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Form submit
   */
  onSubmit() {
    const { name, password } = this.loginForm.value;
    const payload = {
      username: name,
      password: password,
    };

    if (this.f["name"].errors || this.f["password"].errors) {
      this.isLoading = false;
      this.submitted = true;
    } else {
      this.submitted = true;
      this.isLoading = true;
      this.router.navigate(["/app/analytics"]);
      this.authenticationService.login(payload).subscribe({
        next: (resp: any) => {
          switch (resp.messageCode) {
            case "00":
              this.isLoading = false;
              sessionStorage.setItem("user", resp.data.userName);
              sessionStorage.setItem("roles", resp.data.roles);
              sessionStorage.setItem("userGroup", resp.data.userGroup);
              this.router.navigate(["/app/analytics"]);
              // setTimeout(()=>{
              //   this.loginForm.reset();
              // },200)
              break;
            case "01":
              this.isLoading = false;
              // this.loginService.loginUser(payload);
              this.toastr.error(
                resp.message,
                "Invalid Staff Number or password"
              );
              this.router.navigate(["login"]);
              break;
          }
        },
        error:(err) => {
          this.isLoading = false;
          this.toastr.error("Error occured");
        }
    });
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}

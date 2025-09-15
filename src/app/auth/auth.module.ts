import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgbCarouselModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

// Load Icons
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';

import { ToastsContainer } from './login/toasts-container.component';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ToastrModule, ToastrService } from 'ngx-toastr';





@NgModule({
  declarations: [
    ToastsContainer,
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),

    FormsModule,
    NgbToastModule,
    AuthRoutingModule,
    NgbCarouselModule,    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ToastrService]
})
export class AuthModule { 
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}

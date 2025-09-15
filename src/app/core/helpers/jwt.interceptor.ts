import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
} from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { AuthenticationService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService
    ) { }

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
      ): Observable<HttpEvent<unknown>> {
        const token = sessionStorage.getItem("token");
        if (!token) {
          return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {            
              if (event instanceof HttpResponse) {
                const authToken = event.headers.get("Auth");
                if (authToken !== null) {
                  sessionStorage.setItem(
                    "token",
                    authToken
                  );
                }
              }
              return event;
            })
          );
        }
    
        const req1 = request.clone({
          headers: request.headers.set("Auth", `${token}`),
        });
    
        return next.handle(req1).pipe(
          map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              const authToken = event.headers.get("Auth");
              if ( authToken !== null) {               
                sessionStorage.setItem("token", authToken);              
              }
            }
            return event;
          }),
        )
      }
}

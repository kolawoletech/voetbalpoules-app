import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';
import { UserResponse, AuthService } from '../providers/auth/auth.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  whitelistedDomains: Array<string | RegExp> = ['api.voetbalpoules.nl', 'localhost:49939'];
  constructor(private inj: Injector) { }

  isRefreshingToken: boolean = false;
  //more info: https://www.intertech.com/Blog/angular-4-tutorial-handling-refresh-token-with-new-httpinterceptor/
  //use the tokenSubject so that subsequent API calls will wait until the new token has been retrieved
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    if(!this.isWhitelistedDomain(req))
        return next.handle(req);

    return next.handle(req)
      .catch(error => {
          if (error instanceof HttpErrorResponse) {
              switch ((<HttpErrorResponse>error).status) {
                  // case 400:
                  //     return this.handle400Error(error);
                  case 401:
                      return this.handle401Error(req, next);
              }
          } else {
              return Observable.throw(error);
          }
      });
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token }});
  }
  
  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
        const authService = this.inj.get(AuthService);
        this.isRefreshingToken = true;

        // Reset here so that the following requests wait until the token
        // comes back from the refreshToken call.
        this.tokenSubject.next(null);

        return authService.refreshToken()
          .switchMap((response: UserResponse) => {
              if (response.access_token) {
                  this.tokenSubject.next(response.access_token);
                  return next.handle(this.addToken(req, response.access_token));
              }

              // If we don't get a new token, we are in trouble so logout.
              return this.logoutUser();
          })
          .catch(error => {
              // If there is an exception calling 'refreshToken', bad news so logout.
              return this.logoutUser();
          })
          .finally(() => {
              this.isRefreshingToken = false;
          });
    } else {
        return this.tokenSubject
            .filter(token => token != null)
            .take(1)
            .switchMap(token => {
                return next.handle(this.addToken(req, token));
            });
    }
  }
 
  private logoutUser() : ErrorObservable {
    const authService = this.inj.get(AuthService);
    authService.logout();
    return Observable.throw("");
  }  

  //Check if this httpCall needs to be refreshed.
  private isWhitelistedDomain(request: HttpRequest<any>): boolean {
    const requestUrl = new URL(request.url);

    return (
      this.whitelistedDomains.findIndex(
        domain =>
          typeof domain === 'string'
            ? domain === requestUrl.host
            : domain instanceof RegExp ? domain.test(requestUrl.host) : false
      ) > -1
    );
  }
}
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { JwtHelper } from 'angular2-jwt';
import 'rxjs/add/observable/throw';

export class UserResponse {
  token_type: string;
  access_token: string;
  resource: string;
  refresh_token: string;
  expires_in: number;
}

export class ErrorMessage {
  error: string;
  error_description: string;
}

export class JwtToken {
  sub: number;
  name: string;
  role: string[];
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname": string
}

@Injectable()
export class AuthService {
  authUrl: string = 'https://auth.voetbalpoules.nl';
  accessToken: string;
  //idToken: string;
  user: any;

  constructor(private http: HttpClient) {
    this.user = this.getStorageVariable('profile');
    //this.idToken = this.getStorageVariable('id_token');
  }

  private getStorageVariable(name) {
    return JSON.parse(window.localStorage.getItem(name));
  }

  private setStorageVariable(name, data) {
    window.localStorage.setItem(name, JSON.stringify(data));
  }

  // private setIdToken(token) {
  //   this.idToken = token;
  //   this.setStorageVariable('id_token', token);
  // }

  private setAccessToken(token) {
    this.accessToken = token;
    this.setStorageVariable('access_token', token);
  }

  private handleError(operation: String) {
    return (err: any) => {
      let errMsg = 'error in ${operation}() retrieving ${this.authUrl}';
        console.log('${errMsg}:', err);
        if(err instanceof HttpErrorResponse) {
            // you could extract more info about the error if you want, e.g.:
            console.log(`status: ${err.status}, ${err.statusText}`);
            var error : ErrorMessage = JSON.parse(err.error);
            errMsg = error.error_description;
          }
        return Observable.throw(errMsg);
    }
  }

  public isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }

  public login(email: string, password: string): Observable<UserResponse> {
    var headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('scope', '')
      .set('username', email)
      .set('password', password);      

    let url = this.authUrl + '/connect/token';
    return this.http.post<UserResponse>(url, body.toString(), { headers })
      .pipe(
        tap<UserResponse>(authResult => {
          //this.setIdToken(authResult.idToken);
          this.setAccessToken(authResult.access_token);  
          const expiresAt = JSON.stringify((authResult.expires_in * 1000) + new Date().getTime());
          this.setStorageVariable('expires_at', expiresAt);
          var bla = new JwtHelper();
          var token = bla.decodeToken(authResult.access_token) as JwtToken;
          this.setStorageVariable('profile', token);
          this.user = token;
        }), 
        catchError(this.handleError('getData'))
      );    
  }

  public logout() {
    window.localStorage.removeItem('profile');
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('id_token');
    window.localStorage.removeItem('expires_at');

    //this.idToken = null;
    this.accessToken = null;
    this.user = null;
  }

}
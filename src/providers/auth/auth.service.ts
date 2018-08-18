import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { JwtHelper } from 'angular2-jwt';
import { Events } from 'ionic-angular';
import { LocalStorageService } from '../localstorage/localstorage.service';
import 'rxjs/add/observable/throw';
import { SettingsService } from '../settings.service';

export class UserResponse {
  token_type: string;
  access_token: string;
  resource: string;
  refresh_token: string;
  expires_in: number;
}

export class User {
  id: number;
  teamnaam: string;
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
  accessToken: string;
  user: any;

  constructor(public events: Events, private http: HttpClient, private localStorage: LocalStorageService, private settings: SettingsService) {
    this.user = localStorage.getStorageVariable('profile');
  }

  public isAuthenticated() : boolean {
    const expiresAt = this.localStorage.getStorageVariable('expires_at');
    console.log("isAuthenticated: expires: " + new Date(expiresAt*1000).toISOString() + ", user: " + this.user);
    let timeToRefresh = Math.round(new Date().getTime() / 1000);
    return timeToRefresh < expiresAt;
  }

  private setRefreshToken(token) {
     this.localStorage.setStorageVariable('refresh_token', token);
  }

  private setAccessToken(token) {
    this.accessToken = token;
    this.localStorage.setStorageVariable('access_token', token);
  }

  private handleError(operation: string) {
    return (err: any) => {
      let errMsg = 'error in ' + operation;
      console.log('handleError authService: ' + JSON.parse(JSON.stringify(err)));
      if(err instanceof HttpErrorResponse) {
        // you could extract more info about the error if you want, e.g.:
        console.log(`status: ${err.status}, ${err.statusText}`);
        var error : ErrorMessage = err.error; // JSON.parse(err.error);
        errMsg = error.error_description;
      }
      return Observable.throw(errMsg);
    }
  }

  public login(email: string, password: string): Observable<UserResponse> {
    var headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('scope', 'offline_access')
      .set('username', email)
      .set('password', password);      

    return this.getToken(body, headers);
  }

  public loginWithFacebook(facebookToken: string): Observable<UserResponse> {
    var headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new HttpParams()
      .set('grant_type', 'facebook_identity_token')
      .set('scope', 'offline_access')
      .set('assertion', facebookToken);      

    console.log(facebookToken);
    return this.getToken(body, headers);
  }

  public refreshToken(): Observable<UserResponse> {
    const refreshToken = this.getRefreshToken();
  
    var headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      //.set('scope', 'offline_access')
      .set('refresh_token', refreshToken);      
    return this.getToken(body, headers);
  }

  public getAccessToken() : string {
    return this.localStorage.getStorageVariable('access_token');
  }

  public getRefreshToken() : string {
    return this.localStorage.getStorageVariable('refresh_token');
  }

  public logout() {    
    this.localStorage.clearAll();
    this.accessToken = null;
    this.user = null;

    this.events.publish('logout', true); //app.component kan nu naar de root page
  }

  private getToken(body: HttpParams, headers: HttpHeaders) : Observable<UserResponse> {

    let url = this.settings.AuthorizationApiEndpoint + '/connect/token';
    return this.http.post<UserResponse>(url, body.toString(), { headers })
      .pipe(tap<UserResponse>(authResult => {
        this.setAccessToken(authResult.access_token);
        if(authResult.refresh_token)
        {
          this.setRefreshToken(authResult.refresh_token);
          console.log("refresh token:" + authResult.refresh_token);
        }
        const expiresAt = JSON.stringify(authResult.expires_in + Math.round(new Date().getTime() / 1000));
        this.localStorage.setStorageVariable('expires_at', expiresAt);
        var bla = new JwtHelper();
        var token = bla.decodeToken(authResult.access_token) as JwtToken;
        this.localStorage.setStorageVariable('profile', token);
        this.user = token;
      }), catchError(this.handleError('getData')));
  }
}
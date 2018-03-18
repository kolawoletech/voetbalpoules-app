import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { catchError, tap } from 'rxjs/operators';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { JwtHelper } from 'angular2-jwt';
import { Events } from 'ionic-angular';
import { LocalStorageService } from '../localstorage/localstorage.service';
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
  //authUrl: string = 'https://auth.voetbalpoules.nl';
  authUrl: string = 'http://localhost:5000';
  accessToken: string;
  //idToken: string;
  user: any;

  // Observable to send messages to when the user is no long auth'd
  // BehaviorSubject is like a ReplaySubject with a stack depth of 1
  authNotifier: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor(public events: Events, private http: HttpClient, private localStorage: LocalStorageService) {
    this.user = localStorage.getStorageVariable('profile');
    //this.idToken = this.getStorageVariable('id_token');

    this.authNotifier.next(this.isAuthenticated()); // will return true or false
  }

  // private setIdToken(token) {
  //   this.idToken = token;
  //   this.setStorageVariable('id_token', token);
  // }

  private setAccessToken(token) {
    this.accessToken = token;
    this.localStorage.setStorageVariable('access_token', token);
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

  public isAuthenticated() : boolean {
    const expiresAt = this.localStorage.getStorageVariable('expires_at');
    console.log("isAuthenticated: expires: " + expiresAt + ", user: " + this.user);
    return this.user != null && Date.now() < expiresAt;
  }

  public login(email: string, password: string): Observable<UserResponse> {
    var headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('scope', '')
      .set('username', email)
      .set('password', password);      

    return this.getToken(body, headers);
  }

  public loginWithFacebook(facebookToken: string): Observable<UserResponse> {
    var headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new HttpParams()
      .set('grant_type', 'facebook_identity_token')
      .set('scope', '')
      .set('assertion', facebookToken);      

    return this.getToken(body, headers);
  }

  public logout() {    
    this.localStorage.clearAll();
    //this.idToken = null;
    this.accessToken = null;
    this.user = null;

    this.events.publish('logout', true); //app.component kan nu naar de root page
  }

  private getToken(body: HttpParams, headers: HttpHeaders) : Observable<UserResponse> {
    let url = this.authUrl + '/connect/token';
    return this.http.post<UserResponse>(url, body.toString(), { headers })
      .pipe(tap<UserResponse>(authResult => {
        //this.setIdToken(authResult.idToken);
        this.setAccessToken(authResult.access_token);
        const expiresAt = JSON.stringify((authResult.expires_in * 1000) + new Date().getTime());
        this.localStorage.setStorageVariable('expires_at', expiresAt);
        var bla = new JwtHelper();
        var token = bla.decodeToken(authResult.access_token) as JwtToken;
        this.localStorage.setStorageVariable('profile', token);
        this.user = token;
      }), catchError(this.handleError('getData')));
  }
}
import { Injectable } from "@angular/core";
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { NativeStorage } from '@ionic-native/native-storage';
import { VoetbalpoulesTokenModel } from '../facebook-login/voetbalpoules-token.model'

@Injectable()
export class LoginService {
  AUTH_ENDPOINT: string = 'https://auth.voetbalpoules.nl/';

  constructor(
    public http: Http,
    public nativeStorage: NativeStorage
  ){
  }

  doLogin(email: string, password: string): Promise<boolean>
  {
    return this.getVoetbalpoulesToken(email, password)
        .then((tokenModel) => {
            this.nativeStorage.setItem("access_token", tokenModel.access_token);
            return true;        
        });
  }

  getFacebookUser()
  {
    return this.nativeStorage.getItem('facebook_user');
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    var foutje = error.json();
    return Promise.reject(foutje.error_description || error);
  }

  private getVoetbalpoulesToken(email: string, password: string): Promise<VoetbalpoulesTokenModel> {
    var options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.AUTH_ENDPOINT + 'connect/token', "grant_type=password&scope=&username=" + email + "&password=" + password, options)
     .toPromise()
     .then(response => response.json() as VoetbalpoulesTokenModel)
     .catch(this.handleError);
  }

}

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class FacebookLoginService {
  FB_APP_ID: number = 189009751163294;

  constructor(
    public nativeStorage: NativeStorage,
    public fb: Facebook,
    public authService: AuthService    
  ){
    this.fb.browserInit(this.FB_APP_ID, "v2.8");
  }

  public doFacebookLogin()
  {
    console.log("start");
    return this.fb.login(['public_profile']).then(
      response => {
        console.log("facebook login successfull.");
        return this.authService.loginWithFacebook(response.authResponse.accessToken)
          .toPromise()
          .then(
            data => {
              console.log("facebook token authenticated.")
              Promise.resolve("");
            },
            err => {
              console.log("rejected");
              Promise.reject(err.message);
            }
          ),
      err => {
        console.log("facebook call mislukt" + err);
        Promise.reject(err);
      }            
    }).catch(error => {
      let str = JSON.stringify(error, null, 4); // beautiful indented output.
      console.log(str);
      let error_message = this.TranslateError(str);
      return Promise.reject(error_message);
    });
  }

  public doFacebookLogout()
  {
    return this.fb.logout().then(
      response => {
        console.log("facebook logout successfull.");
        Promise.resolve("");
      },
      error => {
        let str = JSON.stringify(error, null, 4);
        console.log("facebook logout error:" + str);
        Promise.reject(error);
    });
  }

  private TranslateError(str) : string {
    let parsedJson : any = JSON.parse(str);
    let error: FacebookError = <FacebookError>parsedJson;
    if(error.errorMessage === "Facebook error: User logged in as different Facebook user.") {
      return "FACEBOOK_ALREADY_LOGGED_IN";
    } 
    else {
      return error.errorMessage;
    }
  }
}

interface FacebookError {
  errorMessage: string;
  errorCode: number;
}

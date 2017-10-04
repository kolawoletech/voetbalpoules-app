import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { FacebookUserModel } from './facebook-user.model';
import {AlertController} from 'ionic-angular';
import { VoetbalpoulesTokenModel } from './voetbalpoules-token.model'

@Injectable()
export class FacebookLoginService {
  FB_APP_ID: number = 189009751163294;

  constructor(
    public http: Http,
    public nativeStorage: NativeStorage,
    public fb: Facebook,
    public alertController: AlertController
  ){
    this.fb.browserInit(this.FB_APP_ID, "v2.8");
  }

  doFacebookLogin()
  {
    return new Promise<FacebookUserModel>((resolve, reject) => {
      //["public_profile"] is the array of permissions, you can add more if you need
      this.fb.login(["public_profile"]).then((response) => {
        //Getting name and gender properties
        let alert = this.alertController.create({
            title: response.authResponse.accessToken,
            subTitle: response.authResponse.secret,
            message: response.authResponse.userID,
            buttons: ['OK']
        });
        alert.present();
        this.getVoetbalpoulesToken(response.authResponse.accessToken).then((tokenModel) => {
          let alert = this.alertController.create({
              title: tokenModel.access_token,
              message: 'OK',
              buttons: ['OK']
          });
          alert.present();          
        });
        this.fb.api("/me?fields=name,gender", [])
        .then((user) => {
          //now we have the users info, let's save it in the NativeStorage
          this.setFacebookUser(user)
          .then((res) => {
            resolve(res);
          });
        })
      }, (err) => {
        reject(err);
      });
    });
  }

  doFacebookLogout()
  {
    return new Promise((resolve, reject) => {
      this.fb.logout()
      .then((res) => {
        //user logged out so we will remove him from the NativeStorage
        this.nativeStorage.remove('facebook_user');
        resolve();
      }, (err) => {
        reject();
      });
    });
  }

  getFacebookUser()
  {
    return this.nativeStorage.getItem('facebook_user');
  }

  setFacebookUser(user: any)
  {
    return new Promise<FacebookUserModel>((resolve, reject) => {
      this.getFriendsFakeData()
      .then(data => {
        resolve(this.nativeStorage.setItem('facebook_user',
          {
            userId: user.id,
            name: user.name,
            gender: user.gender,
            image: "https://graph.facebook.com/" + user.id + "/picture?type=large",
            friends: data.friends,
            photos: data.photos
          })
        );
      });
    });
  }

  getFriendsFakeData(): Promise<FacebookUserModel> {
    return this.http.get('./assets/example_data/social_integrations.json')
     .toPromise()
     .then(response => response.json() as FacebookUserModel)
     .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  private getVoetbalpoulesToken(facebookToken: string): Promise<VoetbalpoulesTokenModel> {
    var options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post('https://auth.voetbalpoules.nl/connect/token', "grant_type=facebook_identity_token&assertion=" + facebookToken, options)
     .toPromise()
     .then(response => response.json() as VoetbalpoulesTokenModel)
     .catch(this.handleError);
  }

}

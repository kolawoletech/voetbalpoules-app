import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { SignupPage } from '../signup/signup';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { LoginService } from './login.service';
import { FacebookLoginService } from '../facebook-login/facebook-login.service';
import { AuthService } from '../../providers/auth/auth.service';

@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: FormGroup;
  main_page: { component: any };
  loading: any;
  validationError: string;

  constructor(
    public nav: NavController,
    public facebookLoginService: FacebookLoginService,
    public loginService: LoginService,
    public loadingCtrl: LoadingController,
    public authService: AuthService) 
  {
    this.main_page = { component: TabsNavigationPage };
    //if(authService.isAuthenticated)
    //{
    //  this.nav.setRoot(this.main_page.component);
    //}

    this.validationError = null;
    this.login = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('test', Validators.required)
    });
  }

  doLogin(values){
    this.loading = this.loadingCtrl.create();
    this.authService.login(this.login.value.email, this.login.value.password)
      .subscribe(
        data => {
          this.nav.setRoot(this.main_page.component);      
          this.loading.dismiss();
        },
        err => {
          this.validationError = err;
          this.loading.dismiss();
        }
      )
  }

  doFacebookLogin() {
    this.loading = this.loadingCtrl.create();

    // Here we will check if the user is already logged in because we don't want to ask users to log in each time they open the app
    // let this = this;

    this.facebookLoginService.getFacebookUser()
    .then((data) => {
       // user is previously logged with FB and we have his data we will let him access the app
      this.nav.setRoot(this.main_page.component);
    }, (error) => {
      //we don't have the user data so we will ask him to log in
      this.facebookLoginService.doFacebookLogin()
      .then((res) => {
        this.loading.dismiss();
        this.nav.setRoot(this.main_page.component);
      }, (err) => {
        console.log("Facebook Login error", err);
      });
    });
  }

  goToSignup() {
    this.nav.push(SignupPage);
  }

  goToForgotPassword() {
    this.nav.push(ForgotPasswordPage);
  }
}

import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { SignupPage } from '../signup/signup';
//import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { FacebookLoginService } from '../../providers/facebook/facebook-login.service';
import { AuthService } from '../../providers/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: FormGroup;
  main_page: { component: any };
  validationError: string;

  constructor(
    public nav: NavController,
    public facebookLoginService: FacebookLoginService,
    public loadingCtrl: LoadingController,
    public authService: AuthService,
    private alertController: AlertController,
    private translate: TranslateService
  ) 
  {
    this.main_page = { component: TabsNavigationPage };

    this.validationError = null;
    this.login = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  public doLogin(values){
    let loading = this.loadingCtrl.create();
    loading.present();
    this.authService.login(this.login.value.email, this.login.value.password)
    .finally(() => loading.dismiss())
    .subscribe(
        data => {
          this.nav.setRoot(this.main_page.component);      
        },
        err => {
          this.validationError = err;
        }
      )
  }

  public doFacebookLogin() {
    let loading = this.loadingCtrl.create();
    loading.present();

    this.facebookLoginService.doFacebookLogin().then(
      res => {
        console.log("Facebook logged in.");
        this.nav.setRoot(this.main_page.component);
        loading.dismiss();
      }, 
      err => {        
        this.validationError = err;  
        loading.dismiss();
      }
    );
  }

  goToSignup() {
    this.nav.push(SignupPage);
  }

  goToForgotPassword() {
    Observable.forkJoin(
      this.translate.get('NOT_IMPLEMENTED'),
      this.translate.get('NOT_IMPLEMENTED_PASSWORD'),
      this.translate.get('OK')
    ).subscribe(data => {
      let alert = this.alertController.create({
        title: data[0],
        subTitle: data[1],
        buttons: [data[2]]
      });
      alert.present();
    });
    //this.nav.push(ForgotPasswordPage);
  }
}

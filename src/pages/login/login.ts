import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
//import { SignupPage } from '../signup/signup';
//import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { FacebookLoginService } from '../../providers/facebook/facebook-login.service';
import { AuthService } from '../../providers/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Keyboard } from '@ionic-native/keyboard';
import { StatusBar } from '@ionic-native/status-bar';

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
    public loadingCtrl: LoadingController,
    public authService: AuthService,
    private alertController: AlertController,
    private translate: TranslateService,
    private platform: Platform,
    private keyboard: Keyboard,
    private statusBar: StatusBar
  ) 
  {
    this.main_page = { component: TabsNavigationPage };
    if(authService.isAuthenticated())
    {
      this.nav.setRoot(this.main_page.component);
    }

    this.validationError = null;
    this.login = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('test', Validators.required)
    });
  }
  ngOnInit() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.keyboard.hideKeyboardAccessoryBar(false);
    });
  }

  public doLogin(values){
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

  public doFacebookLogin() {
    this.loading = this.loadingCtrl.create();

    this.facebookLoginService.doFacebookLogin().then(
      res => {
        console.log("Facebook logged in.");
        this.nav.setRoot(this.main_page.component);
        this.loading.dismiss();
      }, 
      err => {        
        this.validationError = err;  
        this.loading.dismiss();
      }
    );
  }

  goToSignup() {
    Observable.forkJoin(
      this.translate.get('NOT_IMPLEMENTED'),
      this.translate.get('NOT_IMPLEMENTED_SIGN_UP'),
      this.translate.get('OK')
    ).subscribe(data => {
      let alert = this.alertController.create({
        title: data[0],
        subTitle: data[1],
        buttons: [data[2]]
      });
      alert.present();
    });
    //this.nav.push(SignupPage);
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

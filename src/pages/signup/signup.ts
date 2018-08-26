import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

//import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
//import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';

import { SignupCompetitionsPage } from '../signup-competitions/signup-competitions';
import { AuthService } from '../../providers/auth/auth.service';

import { FacebookLoginService } from '../../providers/facebook/facebook-login.service';
import { CreateUserCommand } from './signup.model';
import { SignupService } from './signup.service';
import { ValidationResult } from '../predictions/predictions.model';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  selector: 'signup-page',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signup: FormGroup;
  main_page: { component: any };
  loading: any;
  validationError: string;

  constructor(
    public nav: NavController,
    public modal: ModalController,
    public facebookLoginService: FacebookLoginService,
    public signupService: SignupService,
    public authService: AuthService,
    public loadingCtrl: LoadingController,
    private ga: GoogleAnalytics
  ) {
    this.ga.trackView('signup-data');
    this.main_page = { component: SignupCompetitionsPage };

    this.signup = new FormGroup({
      email: new FormControl('', Validators.required),
      wachtwoord: new FormControl('', Validators.required),
      wachtwoordKopie: new FormControl('', Validators.required),
      naam: new FormControl('', Validators.required),      
      teamnaam: new FormControl('', Validators.required)      
    });
  }

  ionViewWillEnter() {
    console.log("enter signup");
  }

  doSignup(){
    let loading = this.loadingCtrl.create();
    loading.present();
    let createUserCommand = new CreateUserCommand();
    createUserCommand.email = this.signup.get("email").value;
    createUserCommand.naam = this.signup.get("naam").value;
    createUserCommand.teamnaam = this.signup.get("teamnaam").value;
    createUserCommand.wachtwoord = this.signup.get("wachtwoord").value;
    createUserCommand.wachtwoordKopie = this.signup.get("wachtwoordKopie").value;

    return this.signupService.SignUp(createUserCommand)
      //.finally(() => loading.dismiss())
      .subscribe(data => {
        console.log("signup geslaagd");
        this.authService.login(createUserCommand.email, createUserCommand.wachtwoord)
        .finally(() => loading.dismiss())
        .subscribe(
            data => {
              this.nav.setRoot(this.main_page.component);      
            },
            err => {
              this.validationError = err;
            }
          );            
      }, error => {
        loading.dismiss();
        var validationErrors = <ValidationResult>error;
        if(validationErrors != null && validationErrors.errors != null)
          validationErrors.errors.forEach(validationError => {
            validationError.memberNames.forEach(member => {
              this.signup.controls[member.toLowerCase()].setErrors({'error': validationError.errorMessage});
            });                
          });
        if (validationErrors.message != null) {
          this.validationError = validationErrors.message;
        }
      });
  }

  doFacebookSignup() {
    //this.loading = this.loadingCtrl.create();
    // Here we will check if the user is already logged in
    // because we don't want to ask users to log in each time they open the app
    //let env = this;

    // // this.facebookLoginService.getFacebookUser()
    // // .then(function(data) {
    // //    // user is previously logged with FB and we have his data we will let him access the app
    // //   env.nav.setRoot(env.main_page.component);
    // // }, function(error){
    // //   //we don't have the user data so we will ask him to log in
    // //   env.facebookLoginService.doFacebookLogin()
    // //   .then(function(res){
    // //     env.loading.dismiss();
    // //     env.nav.setRoot(env.main_page.component);
    // //   }, function(err){
    // //     console.log("Facebook Login error in signup", err);
    //      env.loading.dismiss();
    // //   });
    // // });
  }

  showTermsModal() {
  //  let modal = this.modal.create(TermsOfServicePage);
  //  modal.present();
  }

  showPrivacyModal() {
  //  let modal = this.modal.create(PrivacyPolicyPage);
  //  modal.present();
  }

}

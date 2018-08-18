import { Component, ViewChild } from '@angular/core';
import { LoadingController, NavController, NavParams, Content } from 'ionic-angular';
import { AuthService } from "../../providers/auth/auth.service";
import { SignupService } from '../signup/signup.service';
import { Competition, ValidationResult } from '../predictions/predictions.model';
import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  selector: 'page-signup-competitions',
  templateUrl: 'signup-competitions.html',
})
export class SignupCompetitionsPage {
  @ViewChild('signupCompetitionsPage') thispage: Content;
  user: any;
  validationError: string;
  competities: Competition[];

  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public auth: AuthService,
    public signUpService: SignupService,
    private ga: GoogleAnalytics
  ) {
    this.ga.trackView('signup-competitions');
  }

  ionViewWillEnter() {
    this.user = this.auth.user;
    let loading = this.loadingCtrl.create();
    loading.present();

    return this.signUpService
      .getCompetities()
      .finally(() => loading.dismiss())
      .subscribe(data => {
        this.competities = data;
      });  
  }

  saveCompetities() {
    let loading = this.loadingCtrl.create();
    loading.present();
    return this.signUpService.saveCompetities(this.competities.filter(x => x.selected))
      //.finally(() => loading.dismiss())
      .catch((error: ValidationResult) => {
        this.validationError = error.message;
        if(error.errors && error.errors.length > 0)
        {
          this.validationError += " (" + error.errors[0].errorMessage + ")";
        }
        this.thispage.scrollToTop();
        loading.dismiss();
        return new ErrorObservable(""); //geen idee wat hier terug moet
      })
      .subscribe((data: boolean)  => {
        loading.dismiss();
        this.navCtrl.setRoot(TabsNavigationPage);
      });
  }
}

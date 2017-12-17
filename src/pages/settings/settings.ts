import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, Platform } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';

import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';

import { LoginPage } from '../login/login';

import 'rxjs/Rx';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from "../../providers/language/language.service";
import { LanguageModel } from "../../providers/language/language.model";
import { AppRate } from '@ionic-native/app-rate';
import {AuthService } from '../../providers/auth/auth.service';

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  settingsForm: FormGroup;
  // make WalkthroughPage the root (or first) page
  rootPage: any = LoginPage;
  loading: any;
  languages: Array<LanguageModel>;

  constructor(
    public nav: NavController,
    public modal: ModalController,
    public loadingCtrl: LoadingController,
    public translate: TranslateService,
    public languageService: LanguageService,
    public appRate: AppRate,
    public platform: Platform,
    public authService: AuthService
  ) {
    this.loading = this.loadingCtrl.create();
    this.languages = this.languageService.getLanguages();

    this.settingsForm = new FormGroup({
      name: new FormControl(),
      description: new FormControl(),
      notifications: new FormControl(),
      language: new FormControl()
    });
  }

  ionViewDidLoad() {
    this.loading.present();
    // setValue: With setValue, you assign every form control value at once by passing in a data object whose properties exactly match the form model behind the FormGroup.
    // patchValue: With patchValue, you can assign values to specific controls in a FormGroup by supplying an object of key/value pairs for just the controls of interest.
    // More info: https://angular.io/docs/ts/latest/guide/reactive-forms.html#!#populate-the-form-model-with-_setvalue_-and-_patchvalue_
    this.settingsForm.patchValue({
      name: this.authService.user.name,
      description: 'Ik ben Jeroen',
      notifications: true,
      language: this.languages[0]
    });

    this.loading.dismiss();

    this.settingsForm.get('language').valueChanges.subscribe((lang) => {
      this.setLanguage(lang);
    });
  }

  logout() {
    this.authService.logout();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(this.rootPage);
  }

  showTermsModal() {
    let modal = this.modal.create(TermsOfServicePage);
    modal.present();
  }

  showPrivacyModal() {
    let modal = this.modal.create(PrivacyPolicyPage);
    modal.present();
  }

  setLanguage(lang: LanguageModel){
    let language_to_set = this.translate.getDefaultLang();

    if(lang){
      language_to_set = lang.code;
    }

    this.translate.setDefaultLang(language_to_set);
    this.translate.use(language_to_set);
  }

  rateApp(){
    this.appRate.preferences.storeAppURL = {
      ios: '<my_app_id>',
      android: 'market://details?id=<package_name>',
      windows: 'ms-windows-store://review/?ProductId=<Store_ID>'
    };

    this.appRate.promptForRating(true);
  }
}

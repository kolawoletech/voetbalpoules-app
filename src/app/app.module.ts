import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, Injector } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Http, HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { PredictionsPage } from '../pages/predictions/predictions';
import { ExtraPage } from '../pages/extra/extra';
import { PoulesPage } from '../pages/mijn/poules';
import { PoulePage } from '../pages/poule/poule';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { TermsOfServicePage } from '../pages/terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';

import { ShowHideContainer } from '../components/show-hide-password/show-hide-container';
import { ShowHideInput } from '../components/show-hide-password/show-hide-input';
import { TabsService } from '../providers/tabs.service';
//import { ColorRadio } from '../components/color-radio/color-radio';
//import { CounterInput } from '../components/counter-input/counter-input';
import { Rating } from '../components/rating/rating';

//import { FeedService } from '../pages/feed/feed.service';
import { PredictionsService } from '../pages/predictions/predictions.service';
import { PoulesService } from '../pages/mijn/poules.service';
import { PouleService } from '../pages/poule/poule.service';
//import { ProfileService } from '../pages/profile/profile.service';
//import { ScheduleService } from '../pages/schedule/schedule.service';
import { FacebookLoginService } from '../providers/facebook/facebook-login.service';

import { BrowserModule } from '@angular/platform-browser';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NativeStorage } from '@ionic-native/native-storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Facebook } from '@ionic-native/facebook';
import { Keyboard } from '@ionic-native/keyboard';
import { AppRate } from '@ionic-native/app-rate';
import { AdMobPro } from '@ionic-native/admob-pro';

// Functionalities
import { ValidatorsModule } from '../components/validators/validators.module';

import { AuthService } from '../providers/auth/auth.service';
import { LanguageService } from '../providers/language/language.service';
import { LocalStorageService} from '../providers/localstorage/localstorage.service';
import { LanguageInterceptor } from '../interceptors/language.interceptor';
import { UnauthorizedInterceptor } from '../interceptors/unauthorized.interceptor';
import { IonDigitKeyboard } from '../components/ion-digit-keyboard/ion-digit-keyboard.module';
import { SignupService } from '../pages/signup/signup.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { ToernooivoorspellingenService } from '../pages/extra/toernooivoorspellingen.service';
import { ToernooiverloopService } from '../pages/extra/toernooiverloop.service';

export function createTranslateLoader(http: Http) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function jwtOptionsFactory(inj: Injector) {
  return {
    tokenGetter: () => {
      const authService = inj.get(AuthService);
      return authService.getAccessToken();
    },
    whitelistedDomains: ['api.voetbalpoules.nl', 'localhost:49939']
  }
}

@NgModule({
  declarations: [
    MyApp,
    PredictionsPage,
    ExtraPage,
    PoulePage,
    PoulesPage,
    LoginPage,
    TabsNavigationPage,
    SettingsPage,
    TermsOfServicePage,
    PrivacyPolicyPage,
    SignupPage,
    WalkthroughPage,
    ForgotPasswordPage,
    ProfilePage,
    Rating,
    ShowHideInput,
    ShowHideContainer
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonDigitKeyboard,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Injector]
      },
    }),
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
		TranslateModule.forRoot({
    loader: {
        provide: TranslateLoader,
      	useFactory: (createTranslateLoader),
        deps: [Http]
		    }
		}),
		ValidatorsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    ExtraPage,
    PoulePage,
    PoulesPage,
    PredictionsPage,
    SettingsPage,
    SignupPage,
    TabsNavigationPage
  ],
  providers: [
    ToernooiverloopService,
    ToernooivoorspellingenService,
    PoulesService,
    PouleService,
    SignupService,
    TabsService,
    PredictionsService,
    FacebookLoginService,
    AuthService,
    LocalStorageService,
    LanguageService,
	  SplashScreen,
	  StatusBar,
    NativeStorage,
    InAppBrowser,
    Facebook,
    Rating,
    AppRate,
    Keyboard,
    AdMobPro,
    GoogleAnalytics,
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: LanguageInterceptor,
      multi: true
    },
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    },
    {
      provide: LOCALE_ID, // takes care of date pipe locale
      deps: [TranslateService], 
      useFactory: getCurrentLanguage
    }    
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}

export function getCurrentLanguage(translateService: TranslateService) {
  return translateService.currentLang;
}
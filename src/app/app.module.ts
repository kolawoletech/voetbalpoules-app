import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Http } from '@angular/http';

import { PredictionsPage } from '../pages/predictions/predictions';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { TermsOfServicePage } from '../pages/terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';
import { AdsPage } from '../pages/ads/ads';

//import { PreloadImage } from '../components/preload-image/preload-image';
//import { BackgroundImage } from '../components/background-image/background-image';
import { ShowHideContainer } from '../components/show-hide-password/show-hide-container';
import { ShowHideInput } from '../components/show-hide-password/show-hide-input';
//import { ColorRadio } from '../components/color-radio/color-radio';
//import { CounterInput } from '../components/counter-input/counter-input';
import { Rating } from '../components/rating/rating';

//import { FeedService } from '../pages/feed/feed.service';
import { PredictionsService } from '../pages/predictions/predictions.service';
//import { ProfileService } from '../pages/profile/profile.service';
//import { ScheduleService } from '../pages/schedule/schedule.service';
import { FacebookLoginService } from '../providers/facebook/facebook-login.service';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NativeStorage } from '@ionic-native/native-storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Facebook } from '@ionic-native/facebook';
import { Keyboard } from '@ionic-native/keyboard';
import { AppRate } from '@ionic-native/app-rate';

// Functionalities
import { ValidatorsModule } from '../components/validators/validators.module';

import { AuthService } from '../providers/auth/auth.service';
import { LanguageService } from '../providers/language/language.service';
import { LocalStorageService} from '../providers/localstorage/localstorage.service';
import { LanguageInterceptor } from '../interceptors/language.interceptor';

export function createTranslateLoader(http: Http) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function jwtOptionsFactory(localStorageService) {
  return {
    tokenGetter: () => {
      return localStorageService.getStorageVariable('access_token');
    },
    whitelistedDomains: ['api.voetbalpoules.nl']
  }
}

@NgModule({
  declarations: [
    MyApp,
    PredictionsPage,
    LoginPage,
    TabsNavigationPage,
    SettingsPage,
    TermsOfServicePage,
    PrivacyPolicyPage,
    SignupPage,
    WalkthroughPage,
    ForgotPasswordPage,
    AdsPage,
    ProfilePage,
    Rating,
    ShowHideInput,
    ShowHideContainer
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [LocalStorageService]
      },
    }),    
    IonicModule.forRoot(MyApp),
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
    PredictionsPage,
    LoginPage,
    TabsNavigationPage,
    SettingsPage
  ],
  providers: [
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
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: LanguageInterceptor,
      multi: true
    }
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}

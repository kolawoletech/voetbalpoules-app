import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, App, ToastController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Observable } from 'rxjs/Observable';

import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { SettingsPage } from '../pages/settings/settings';
import { LoginPage } from '../pages/login/login';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AuthService } from '../providers/auth/auth.service';
import { Events } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  selector: 'app-root',
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  // make WalkthroughPage the root (or first) page
  //rootPage: any = WalkthroughPage;
  rootPage: any; // = TabsNavigationPage;
  textDir: string = "ltr";

  pages: Array<{title: any, icon: string, component: any}>;
  pushPages: Array<{title: any, icon: string, component: any}>;

  constructor(
    platform: Platform,
    public menu: MenuController,
    public app: App,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public translate: TranslateService,
    public authService: AuthService,
    public toastCtrl: ToastController,
    public events: Events,
    public keyboard: Keyboard
  ) {
    translate.setDefaultLang('nl');
    translate.use('nl');
    // if(authService.isAuthenticated())
    // {
    //   console.log("authenticated, ga direct door naar de tabs.")
    //   this.rootPage = TabsNavigationPage;
    // }  

    platform.ready().then(() => {
      if(platform.is('cordova'))
      {
          // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        //this.splashScreen.show(); //hide();
        this.statusBar.styleDefault();
        this.keyboard.hideKeyboardAccessoryBar(false);          
      }
    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) =>
      {
        platform.setDir('ltr', true);
        platform.setDir('rtl', false);

        Observable.forkJoin(
          this.translate.get('PREDICT'),
          this.translate.get('SETTINGS')
        ).subscribe(data => {
          this.pages = [
            { title: data[0], icon: 'home', component: TabsNavigationPage }
          ];

          this.pushPages = [
            { title: data[1], icon: 'settings', component: SettingsPage }
          ];
        });
      });
    this.events.subscribe('logout', (loggedOut) => {
      console.log('logout: ', loggedOut);
      if (loggedOut) {
        this.nav.setRoot(LoginPage);
        this.nav.popToRoot();
      }
    });  
  }

  ngAfterContentInit() {
    console.log("APP started");
    // Listen to authNotifier
    this.authService.authNotifier
      // filter on null so our app will wait for a real response
      .filter(res => res !== null)
      .subscribe(status => {
        console.log("APP AuthNotifier said: ",status);
        if(!status){ // when not auth'd
          console.log("APP Logging out!");
          this.nav.setRoot(LoginPage);
          // this.authService.logout().subscribe(res => { // logout and then redirect to login
          //   console.log("Logged out.",res);
          //   this.nav.setRoot('LoginPage');
          // });
        }
        else {
          this.nav.setRoot(TabsNavigationPage);
        }
      });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  pushPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // rootNav is now deprecated (since beta 11) (https://forum.ionicframework.com/t/cant-access-rootnav-after-upgrade-to-beta-11/59889)
    this.app.getRootNav().push(page.component);
  }
}

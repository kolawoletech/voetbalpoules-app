import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

/**
 * Generated class for the ExtraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-extra',
  templateUrl: 'extra.html',
})
export class ExtraPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private ga: GoogleAnalytics) {
    this.ga.trackView('extra');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExtraPage');
  }
}

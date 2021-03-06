import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { PouleModel, PouleUserCompetitie } from '../mijn/poules.model';
import { User } from '../../providers/auth/auth.service';
import { PouleService } from './poule.service';
import { PredictionsPage } from '../predictions/predictions';
import { PouleStandUser } from './poule.model';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  selector: 'page-poule',
  templateUrl: 'poule.html',
})
export class PoulePage {
  poule: PouleModel;
  competitie: PouleUserCompetitie;
  users: PouleStandUser[];

  constructor(public loadingCtrl: LoadingController, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public pouleService: PouleService, 
    public ga: GoogleAnalytics
  ) {
    ga.trackView("poule");
    this.poule = navParams.get("poule");
    this.competitie = navParams.get("competitie");
  }

  ionViewWillEnter() {
    let loading = this.loadingCtrl.create();
    loading.present();

    return this.pouleService
      .getStand(this.poule.id, this.competitie.id)
      .finally(() => loading.dismiss())
      .subscribe(data => {
        this.users = data;
      });  
  }

  goBack() {
    console.log("popping");
    this.navCtrl.pop();
  }

  navToVoorspelling(user: PouleStandUser)
  {
    this.ga.trackEvent("poule", "predictions");

    let usertje: User = new User();
    usertje.id = user.userId;
    usertje.teamnaam = user.teamnaam;

    this.navCtrl.push(PredictionsPage, {
        user: usertje
      });
  }
}

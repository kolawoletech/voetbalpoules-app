import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { AuthService } from "../../providers/auth/auth.service";
import { PoulesService } from './poules.service';
import { PoulePage } from '../poule/poule';
import { PouleModel, PouleUserCompetitie } from './poules.model';

@Component({
  selector: 'poules-page',
  templateUrl: 'poules.html'
})
export class PoulesPage {
  poules: PouleModel[];
  competities: PouleUserCompetitie[];
  selectedCompetitie: PouleUserCompetitie;
  user: any;

  constructor(
    public poulesService: PoulesService,
    public auth: AuthService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController
  ) {

  }

  ionViewWillEnter() {
    this.user = this.auth.user;

    let loading = this.loadingCtrl.create();
    loading.present();

    return this.poulesService
      .getData(this.user.sub)
      .finally(() => loading.dismiss())
      .subscribe(data => {
        this.poules = data;
        if(this.poules.length > 0 && !this.competities) {
            this.competities = this.poules[0].competities;
            this.selectedCompetitie = this.competities[0];
        }
      });  
  }

  getCompetitie(poule: PouleModel) : PouleUserCompetitie {
    if(this.selectedCompetitie)
        return poule.competities.filter(x => x.id === this.selectedCompetitie.id)[0];
    return null;
  }

  navToPoule(poule: PouleModel)
  {
    this.navCtrl.push(PoulePage, {
        poule: poule,
        competitie: this.selectedCompetitie
      });
  }
}

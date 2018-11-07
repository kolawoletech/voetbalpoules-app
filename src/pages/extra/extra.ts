import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, Select } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { VoorspellingEindstandDto, TopscorerDto, VoorspellingEindstand } from '../toernooiverloop/toernooivoorspellingen.model';
import { AuthService } from "../../providers/auth/auth.service";
import { Competition } from '../predictions/predictions.model';
import { ExtraVoorspellingenService } from './extravoorspellingen.service';
import { ExtraVoorspellingen, TeamRanglijst } from './extravoorspellingen.model';

@Component({
  selector: 'page-extra',
  templateUrl: 'extra.html',
})
export class ExtraPage {
  userId: number;
  userCompetities: Competition[];
  selectedCompetitie: Competition;
  groepen: Competition[];
  voorspellingen: ExtraVoorspellingen;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private ga: GoogleAnalytics, 
    public loadingCtrl: LoadingController,
    public authService: AuthService,    
    public extraVoorspellingenService: ExtraVoorspellingenService) {
    this.ga.trackView('extra');
    this.userId = navParams.get("userId");
    if(!this.userId)
      this.userId = authService.user.sub;
    console.log("userId: " + this.userId);
  }

  ionViewWillEnter() {
    let loading = this.loadingCtrl.create();
    loading.present();
    return this.extraVoorspellingenService
      .getCompetities(this.userId)
      .finally(() => {
        console.log("dismiss loading");
        loading.dismiss();
        console.log("dismiss loading klaar");
      })
      .subscribe(data => {
        this.userCompetities = data;
        this.selectedCompetitie = this.userCompetities[0];

        return this.getUserVoorspellingen(this.userId, this.selectedCompetitie.id);
    });  
  }

  getUserVoorspellingen(userId: number, competitieId: number) {
    return this.extraVoorspellingenService.get(userId, competitieId)
    .subscribe(data => {
      console.log("voorspellingen binnen!");
      //jaja: haal de competitieid uit de voorspellingen en filter deze op unieke waarde.
      //this.groepen = data.competities Array.from(data.voorspellingenEindstand, p => p.competitieGroepId).filter((v, i, a) => a.indexOf(v) === i);
      this.voorspellingen = data;
      //als een competitie geen groepen heeft, gebruiken we de hoofdcompetitie
      this.groepen = (data.competities && data.competities.length > 0) ? data.competities : Array.of(this.userCompetities.find(x => x.id == competitieId));
      debugger;
      console.log("voorspellingen " + data);
     },
   error => {
     console.log("voorspellingen foutje " + error);
   });      
  }  

  competitieChanged(competitie: Competition) {
    console.log(competitie.id);
    return this.getUserVoorspellingen(this.userId, competitie.id);
  }

  getVoorspellingen(groep: Competition): VoorspellingEindstandDto[]
  {
    debugger;
    let voorspellingen: VoorspellingEindstandDto[] = new Array<VoorspellingEindstandDto>();

    for (let index = 1; index <= this.voorspellingen.teams.filter(t => t.competitieId == groep.id).length; index++) {
      let positie = new VoorspellingEindstandDto();

      positie.eindpositie = index;

      let voorspelling = this.voorspellingen.voorspellingenEindstand.find(x => x.competitieGroepId == groep.id && x.eindpositie == index);
      if(voorspelling)
      {
        positie.punten = voorspelling.punten;
        positie.team = this.getTeam(voorspelling.teamId);
      }
      else {
        positie.team = new TeamRanglijst();
      }
      voorspellingen.push(positie);
    }
    return voorspellingen;
  }

  getTopscorer() : TopscorerDto
  {
    if(this.voorspellingen && this.voorspellingen.topscorer)    
      return this.voorspellingen.topscorer;
    return new TopscorerDto();
  }

  getTeam(teamId: number): TeamRanglijst
  {
    if(this.voorspellingen && this.voorspellingen.teams)
      return this.voorspellingen.teams.find(x => x.id == teamId);
    return new TeamRanglijst();
  }
}

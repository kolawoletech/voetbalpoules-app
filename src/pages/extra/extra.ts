import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { ToernooivoorspellingenService } from './toernooivoorspellingen.service';
import { ToernooiverloopService } from './toernooiverloop.service';
import { Toernooiverloop, VoorspelType } from './toernooiverloop.model';
import { ToernooiverloopVoorspellingen, VoorspellingEindstand, VoorspellingEindstandDto, FinaleWedstrijd, FinaleRonde, FinaleTeam, TopscorerDto } from './toernooivoorspellingen.model';
import { AuthService, User } from "../../providers/auth/auth.service";
import { Competition, Team } from '../predictions/predictions.model';

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

  userId: number;
  toernooischema: Toernooiverloop = new Toernooiverloop();
  voorspellingen: ToernooiverloopVoorspellingen;
  groepen: Competition[];
  segment: string = "finales";

  arraytje(n: number): number[] {
    return Array.from(Array(n).keys()).map(i => i + 1);
  }
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private ga: GoogleAnalytics, 
    public loadingCtrl: LoadingController,
    public authService: AuthService,    
    public voorspellingenService: ToernooivoorspellingenService,
    public toernooischemaService: ToernooiverloopService) {
    this.ga.trackView('extra');
    this.userId = navParams.get("userId");
    if(!this.userId)
      this.userId = authService.user.sub;
    console.log("userId: " + this.userId);
  }

  ionViewWillEnter() {
    let loading = this.loadingCtrl.create();
    loading.present();
    return this.toernooischemaService
      .get()
      .finally(() => {
        console.log("dismiss loading");
        loading.dismiss();
        console.log("dismiss loading klaar");
      })
      .subscribe(data => {
        this.toernooischema = data;

        return this.voorspellingenService.get(this.userId)
           .subscribe(data => {
             console.log("voorspellingen binnen!");
             this.voorspellingen = data;
             console.log("voorspellingen " + data);
             this.groepen = this.toernooischema.competitieRondes.filter(x => x.type == 40);
             console.log("groepen " + this.groepen);
            },
          error => {
            console.log("voorspellingen foutje " + error);
          })
      });  
  }
  
  getVoorspellingen(groep: Competition): VoorspellingEindstandDto[]
  {
    let voorspellingen: VoorspellingEindstandDto[] = new Array<VoorspellingEindstandDto>();

    for (let index = 1; index <= 4; index++) {
      let positie = new VoorspellingEindstandDto();

      positie.eindpositie = index;

      let voorspelling = this.voorspellingen.voorspellingenEindstand.find(x => x.competitieGroepId == groep.id && x.eindpositie == index);
      if(voorspelling)
      {
        positie.punten = voorspelling.punten;
        positie.team = this.getTeam(voorspelling.teamId);
      }
      else {
        positie.team = new Team();
      }
      voorspellingen.push(positie);
    }
    return voorspellingen;
  }

  getVoorspellingenFinales(): FinaleRonde[]
  {    
    //let finales: FinaleWedstrijd[] = new Array<FinaleWedstrijd>();

    let rondes: FinaleRonde[] = new Array<FinaleRonde>();

    //competitie: Competition;
    //finales: FinaleWedstrijd[];
    let voorspelType: VoorspelType;
    let ronde: FinaleRonde;
    if(!this.toernooischema || !this.toernooischema.schema) return rondes;
    this.toernooischema.schema.forEach(finaleWedstrijd => {
      if(voorspelType != finaleWedstrijd.voorspelType)
      {
          ronde = new FinaleRonde();
          ronde.competitie = this.toernooischema.competitieRondes.find(x => x.id == finaleWedstrijd.competitieRondeId);
          ronde.finales = new Array<FinaleWedstrijd>();
          voorspelType = finaleWedstrijd.voorspelType;
          rondes.push(ronde);
      }
      let finale: FinaleWedstrijd = new FinaleWedstrijd();
      finale.wedstrijdNummer = finaleWedstrijd.wedstrijdNummer;

      let voorspelling = this.voorspellingen.voorspellingenKnockout.finales.find(x => x.wedstrijdNummer == finaleWedstrijd.wedstrijdNummer);

      if(voorspelling)
      {
        finale.thuisTeam = voorspelling.thuisTeam;
        finale.uitTeam = voorspelling.uitTeam;
      }
      ronde.finales.push(finale);
    });
    return rondes;
  }

  getNummer3() : FinaleTeam
  {
    if(this.voorspellingen && this.voorspellingen.voorspellingenKnockout)    
      return this.voorspellingen.voorspellingenKnockout.nummer3;
    return new FinaleTeam();
  }

  getWinnaar() : FinaleTeam
  {
    if(this.voorspellingen && this.voorspellingen.voorspellingenKnockout)    
      return this.voorspellingen.voorspellingenKnockout.winnaar;
    return new FinaleTeam();
  }

  getTopscorer() : TopscorerDto
  {
    if(this.voorspellingen && this.voorspellingen.topscorer)    
      return this.voorspellingen.topscorer;
    return new TopscorerDto();
  }

  getTeam(teamId: number): Team
  {
    if(this.toernooischema && this.toernooischema.teams)
      return this.toernooischema.teams.find(x => x.id == teamId);
    return new Team();
  }
}

import { Component } from '@angular/core';
import { LoadingController, Events } from 'ionic-angular';
import { AuthService } from "../../providers/auth/auth.service";
import { PredictionsModel } from './predictions.model';
import { PredictionsService } from './predictions.service';
import { Team } from './predictions.model';

@Component({
  selector: 'predictions-page',
  templateUrl: 'predictions.html',
})
export class PredictionsPage {
  listing: PredictionsModel = new PredictionsModel();
  loading: any;
  user: any;
  auth: AuthService;

  constructor(
    public predictionsService: PredictionsService,
    public loadingCtrl: LoadingController,
    public authService: AuthService,
    private events: Events
  ) {
    this.auth = authService;
  }


  ionViewWillEnter() {
    if(!this.auth.isAuthenticated())
    {
      console.log("niemand ingelogd.");
      this.events.publish('logout', true); //app.component kan nu naar de root page      
    } else {
      this.user = this.auth.user;
      this.loading = this.loadingCtrl.create();
      this.predictionsService
        .getData(this.user.sub)
        .subscribe(data => {
          this.listing.voorspellingen = data.voorspellingen;
          this.loading.dismiss();
        });  
    }
  }

  getLogo(team : Team) : string {
    return "https://www.voetbalpoules.nl/foto/" + team.logoId;
  } 
}

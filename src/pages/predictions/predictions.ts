import { Component, ViewChild } from '@angular/core';
import { LoadingController, Events, Slides } from 'ionic-angular';
import { AuthService } from "../../providers/auth/auth.service";
import { PredictionsModel } from './predictions.model';
import { PredictionsService } from './predictions.service';
import { Team } from './predictions.model';

export class SpeelDag {
  constructor(
    public number: number, 
    public Datum: Date,
    public listing: PredictionsModel = new PredictionsModel()
  ) {}
}

@Component({
  selector: 'predictions-page',
  templateUrl: 'predictions.html',
})
export class PredictionsPage {
  loading: any;
  user: any;
  auth: AuthService;
  nextDay: Date;
  previousDay: Date;
  numbers: SpeelDag[] = [];

  @ViewChild('slider') private slider: Slides;
  firstLoad = true;

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
          let speeldag = new SpeelDag(0, data.datum);
          speeldag.listing.voorspellingen = data.voorspellingen;

          this.numbers.push(speeldag);
          this.nextDay = data.volgendeDag;
          speeldag = new SpeelDag(1, data.volgendeDag);
          this.numbers.push(speeldag);
          this.previousDay = data.vorigeDag;
          speeldag = new SpeelDag(-1, data.vorigeDag);
          //this.numbers.unshift(speeldag);
          this.loading.dismiss();
        });  
    }
  }

  loadPrev() {
    console.log('Prev');
    let newIndex = this.slider.getActiveIndex();
    
    newIndex++;
    this.numbers.unshift(new SpeelDag(this.numbers[0].number - 1, new Date(2018,2,5)));
    this.numbers.pop();
    
    // Workaround to make it work: breaks the animation
    this.slider.slideTo(newIndex, 0, false);
    
    console.log(`New status: ${this.numbers}`);
	}
	
	loadNext() {
    
    console.log('Next');
    let newIndex = this.slider.getActiveIndex();
    console.log('newindex');
    
    this.loading = this.loadingCtrl.create();
    this.predictionsService
      .getData(this.user.sub, this.nextDay)
      .subscribe(data => {
        this.numbers[newIndex].listing.voorspellingen = data.voorspellingen;
        let speeldag = new SpeelDag(this.numbers.length, data.volgendeDag);
        this.numbers.push(speeldag);
        this.nextDay = data.volgendeDag;
        this.loading.dismiss();

        this.numbers.shift();
        newIndex--;
        // Workaround to make it work: breaks the animation
        this.slider.slideTo(newIndex, 0, false);
      });  

    
    console.log(`New status: ${this.numbers}`);
	}

  getLogo(team : Team) : string {
    return "https://www.voetbalpoules.nl/foto/" + team.logoId;
  } 
}

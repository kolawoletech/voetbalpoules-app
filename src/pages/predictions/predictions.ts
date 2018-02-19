import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { LoadingController, Events, Slides, Slide } from 'ionic-angular';
import { AuthService } from "../../providers/auth/auth.service";
import { PredictionsModel } from './predictions.model';
import { PredictionsService } from './predictions.service';
import { Team } from './predictions.model';

@Component({
  selector: 'predictions-page',
  templateUrl: 'predictions.html',
})
export class PredictionsPage {
  loading: any;
  user: any;
  auth: AuthService;

  @ViewChild('slider') private slider: Slides;
  @ViewChildren(Slide) slideCollection: QueryList<Slide>;
  speelData: PredictionsModel[] = [];

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
      return;
    }
    console.log("Leeg speeldata");
    this.user = this.auth.user;
    this.speelData = [];
    console.log("Haal eerstvolgende voorspellingen.");

    let subscription = this.slideCollection.changes.subscribe((r) => {
      setTimeout(() => {
        console.log("zet initialSlide");
        this.slider.slideTo(this.slider.initialSlide, 0, false);
        //we hoeven alleen de eerste keer de juiste slide te zetten.
        subscription.unsubscribe();
      });
    });
    this.loading = this.loadingCtrl.create();

    return this.predictionsService
      .getData(this.user.sub)
      .finally(() => this.loading.dismiss())
      .subscribe(data => {
        console.log("verwerk data");
        var previousDay = new PredictionsModel(data.vorigeDag);
        this.speelData.push(previousDay);
        console.log("pushed gisteren");
        this.speelData.push(data);
        console.log("pushed vandaag");

        var nextDay = new PredictionsModel(data.volgendeDag);
        nextDay.datum = data.volgendeDag;
        this.speelData.push(nextDay);
        console.log("pushed morgen");
      });  
  }

  loadPrev() {
    console.log('Prev');
    this.loadSlide(false);
	}
	
	loadNext() {    
    console.log('Next');
    this.loadSlide(true);
  }

  private loadSlide(isNext: Boolean)
  {
    let currentIndex = this.slider.getActiveIndex();
    console.log("Huidige slide" + currentIndex);
    
    var today = this.speelData[currentIndex];
    if(today.voorspellingen)
    {
      console.log(today.datum + " heeft al voorspellingen!");
      return;
    }
    this.loading = this.loadingCtrl.create();
    return this.predictionsService
      .getData(this.user.sub, today.datum)
      .finally(() => this.loading.dismiss())
      .subscribe(data => {
        this.speelData[currentIndex] = data;
        var newSlide = new PredictionsModel(isNext ? data.volgendeDag : data.vorigeDag);

        if(isNext)
        {
          currentIndex--;
          this.speelData.push(newSlide);
        }
        else
        {
          currentIndex++;
          this.speelData.unshift(newSlide);
          console.log("zet slider in loadSlide")
          this.slider.slideTo(currentIndex, 0, false);
        }
      });          
  }

  getLogo(team : Team) : string {
    return "https://www.voetbalpoules.nl/foto/" + team.logoId;
  } 
}

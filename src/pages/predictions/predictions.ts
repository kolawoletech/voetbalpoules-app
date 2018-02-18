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
  nextDay: Date;
  previousDay: Date;
  speelData: PredictionsModel[] = [];

  @ViewChild('slider') private slider: Slides;

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

      if(this.speelData.length > 0)
        return;

      console.log("Haal eerstvolgende voorspellingen.");
      let currentIndex = this.slider.getActiveIndex();
      console.log("Huidige slide" + currentIndex);
      this.loading = this.loadingCtrl.create();
      this.predictionsService
        .getData(this.user.sub)
        .subscribe(data => {
          var previousDay = new PredictionsModel();
          previousDay.datum = data.vorigeDag;
          this.speelData.push(previousDay);

          this.speelData.push(data);

          var nextDay = new PredictionsModel();
          nextDay.datum = data.volgendeDag;
          this.speelData.push(nextDay);

          this.loading.dismiss();
        });  
    }
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
    this.predictionsService
      .getData(this.user.sub, today.datum)
      .subscribe(data => {
        this.speelData[currentIndex] = data;
        var newSlide = new PredictionsModel();

        newSlide.datum = isNext ? data.volgendeDag : data.vorigeDag;
        if(isNext)
          this.speelData.push(newSlide);
        else
        {
          this.speelData.unshift(newSlide);
          currentIndex++;
          // Workaround to make it work: breaks the animation
          this.slider.slideTo(currentIndex, 0, false);
        }

        this.loading.dismiss();
      });          
  }

  getLogo(team : Team) : string {
    return "https://www.voetbalpoules.nl/foto/" + team.logoId;
  } 
}

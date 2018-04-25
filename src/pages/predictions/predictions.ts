import { IonDigitKeyboardCmp } from '../../components/ion-digit-keyboard';
import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { LoadingController, Events, Slides, Slide, Refresher } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from "../../providers/auth/auth.service";
import { PredictionsModel, ValidationResult, WeekPositie } from './predictions.model';
import { PredictionsService } from './predictions.service';
import { Team, Prediction, Match, PredictionCommand } from './predictions.model';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';
import { TabsService } from '../../providers/tabs.service';
import { PredictionValidations } from './predictions.validations';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'predictions-page',
  templateUrl: 'predictions.html',
})
export class PredictionsPage {
  subscription: Subscription;
  user: any;
  auth: AuthService;

  @ViewChild('slider') private slider: Slides;
  @ViewChildren(Slide) slideCollection: QueryList<Slide>;
  @ViewChild(IonDigitKeyboardCmp) keyboard;

  speelData: PredictionsModel[] = [];
  slideForm: FormGroup;
  currentFieldThuis: boolean;
  currentVoorspelling: Prediction;
  keyboardHeader: string;
  thuisdoelpunten: string = '';

  constructor(
    public predictionsService: PredictionsService,
    public loadingCtrl: LoadingController,
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public tabsService: TabsService,
    private events: Events,
    private translate: TranslateService
  ) {
    this.auth = authService;
  }

  ngOnInit() {
    this.slideForm = new FormGroup({});
console.log("init")
  }

  ionViewWillLeave() { //ngOnDestroy
    console.log("kill m'allllllllllllllllllllllllllllllll");
    this.subscription.unsubscribe();
  }

  public isValid(voorspelling: Prediction, fieldName: string) : boolean { 
    let formGroup = this.slideForm.controls["voorspelling-" + voorspelling.wedstrijd.id] as FormGroup;
    return formGroup.controls[fieldName].valid; 
  }

  public errorMessage(voorspelling: Prediction, fieldName: string) : Observable<string> { 
    let formGroup = this.slideForm.controls["voorspelling-" + voorspelling.wedstrijd.id] as FormGroup;
    let error = formGroup.controls[fieldName].getError("error"); 
    return this.translate.get(error);
  }

  setFocus(voorspelling: Prediction, isThuis: boolean) {
    document.querySelector((isThuis ? "#t-" : "#u-") + voorspelling.wedstrijd.id).classList.add('selected');
    document.querySelector((isThuis ? "#u-" : "#t-") + voorspelling.wedstrijd.id).classList.remove('selected');
    this.currentFieldThuis = isThuis;
    this.currentVoorspelling = voorspelling;

    this.setKeyboardHeader(voorspelling, isThuis);
    this.showKeyboard();
  }

  private setKeyboardHeader(voorspelling: Prediction, isThuis: boolean)
  {
    let keyboardHeader = isThuis ? voorspelling.wedstrijd.thuisteam.naam : voorspelling.wedstrijd.uitteam.naam;
    if(isThuis && voorspelling.thuisdoelpunten != null)
      keyboardHeader += " (" + voorspelling.thuisdoelpunten + ")";
    if(!isThuis && voorspelling.uitdoelpunten != null)
      keyboardHeader += " (" + voorspelling.uitdoelpunten + ")";
    this.keyboardHeader = keyboardHeader;
  }

  showKeyboard() {
    this.tabsService.hide();
    this.keyboard.show();    
  }

  hideKeyboard() {
    if(this.currentFieldThuis != null && this.currentVoorspelling != null)
    {
      document.querySelector("#t-" + this.currentVoorspelling.wedstrijd.id).classList.remove('selected');
      document.querySelector("#u-" + this.currentVoorspelling.wedstrijd.id).classList.remove('selected');
      this.currentFieldThuis = null;
      this.currentVoorspelling = null;  
    }

    var hideCallback = () : void => {
      this.keyboardHeader = null;
      //Hier moet een timeout omheen, anders klik je bij de 0 direct op de tabbar...
      setTimeout(() => { 
        this.tabsService.show(); 
      }, 250); 
    }
    this.keyboard.hide(hideCallback);
  }

  ionViewWillEnter() {
    this.user = this.auth.user;
    if(!this.user)
    {
       console.log("niemand ingelogd.");
       this.events.publish('logout', true); //app.component kan nu naar de root page
       return;
    }

    /**
     * Since we want to prevent native keyboard to show up, we put the disabled
     * attribute on the input, and manage focus programmaticaly.
     */
    this.subscription = this.keyboard.onClick.subscribe((key: any) => {
      let voorspelling = this.currentVoorspelling;
      if (typeof key == 'number') {
        let formGroup = this.slideForm.controls["voorspelling-" + voorspelling.wedstrijd.id];
        if(this.currentFieldThuis) {
          voorspelling.thuisdoelpunten = key; // template toont deze value...
          var control = <FormControl>formGroup.get('thuisdoelpunten');
          control.markAsDirty();
          control.setValue(key);
        }
        else {
          voorspelling.uitdoelpunten = key; // template toont deze value...
          var control2 = <FormControl>formGroup.get('uitdoelpunten');
          control2.markAsDirty();
          control2.setValue(key);
        }
      }
      if(this.currentFieldThuis) {
        this.setFocus(voorspelling, false);
      }
      else {
        this.hideKeyboard();
      }
    });

    // (BLur) Clear focus field name on keyboard hide
    const keyboardsubscription = this.keyboard.onHide.subscribe(() => {
      this.hideKeyboard();
    });
    this.subscription.add(keyboardsubscription);
    
    console.log("Leeg speeldata");
    this.slideForm = new FormGroup({});
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
    let loading = this.loadingCtrl.create();
    loading.present();

    return this.predictionsService
      .getData(this.user.sub)
      .finally(() => loading.dismiss())
      .subscribe(data => {
        console.log("verwerk data");
        var previousDay = new PredictionsModel(data.vorigeDag);
        this.speelData.push(previousDay);
        console.log("pushed gisteren");
        this.speelData.push(data);
        console.log("pushed vandaag");

        this.mapVoorspellingen(data.voorspellingen);

        var nextDay = new PredictionsModel(data.volgendeDag);
        nextDay.datum = data.volgendeDag;
        this.speelData.push(nextDay);
        console.log("pushed morgen");
      });  
  }

  private mapVoorspellingen(voorspellingen: Prediction[])
  {
    voorspellingen.map((voorspelling, index) => {
      const name = 'voorspelling-' + voorspelling.wedstrijd.id.toString();
      const formGroup = this.formBuilder.group({
        wedstrijdId: [''],
        thuisdoelpunten: ['', [Validators.required]],
        uitdoelpunten: ['', [Validators.required]]
      });

      formGroup.setValue({
        wedstrijdId: voorspelling.wedstrijd.id,
        thuisdoelpunten: voorspelling.thuisdoelpunten,
        uitdoelpunten: voorspelling.uitdoelpunten
      });
      if(voorspelling.wedstrijd.wedstrijdVanDeWeek)
      {
        formGroup.addControl("thuisspelerId", new FormControl(voorspelling.thuisspeler ? voorspelling.thuisspeler.id : null));
        formGroup.addControl("uitspelerId", new FormControl(voorspelling.uitspeler ? voorspelling.uitspeler.id : null));

        formGroup.setValidators( Validators.compose([PredictionValidations.wedstrijdVanDeWeek]));

        //doelpunt op 0? Selecteer dan gelijk 'Geen score'
        let subscribe = formGroup.controls["thuisdoelpunten"].valueChanges.subscribe(value => {
          if(value == 0)
            formGroup.controls["thuisspelerId"].setValue(-1);
        });
        this.subscription.add(subscribe);

        let subscribeUit = formGroup.controls["uitdoelpunten"].valueChanges.subscribe(value => {
          if(value == 0)
            formGroup.controls["uitspelerId"].setValue(-1);
        });
        this.subscription.add(subscribeUit);
      }

      let subscription = formGroup.valueChanges.subscribe(voorspelling => {
        console.log("save voorspelling? " + formGroup.dirty + ' ' + formGroup.valid);
        if(formGroup.dirty && formGroup.valid)
        {
          return this.save(voorspelling)
            .subscribe(data => {
              formGroup.markAsPristine();
              console.log("voorspelling opgeslagen" + index);
              voorspellingen[index].foutmelding = null;
              voorspellingen[index].opgeslagen = true; 
              // setTimeout(function() { //doei na 1,5 seconde
              //    voorspellingen[index].opgeslagen = false;
              // }.bind(this), 3000);            
            }, error => {
              voorspellingen[index].opgeslagen = false; 
              var validationErrors = <ValidationResult>error;
              if(validationErrors != null && validationErrors.errors != null)
                validationErrors.errors.forEach(validationError => {
                  validationError.memberNames.forEach(member => {
                    formGroup.controls[member].setErrors({'error': validationError.errorMessage});
                  });                
                });
              if (validationErrors.message != null) {
                voorspellingen[index].foutmelding = validationErrors.message;
              }
            });
        }
        if(formGroup.invalid)
          voorspellingen[index].opgeslagen = false; 
      });
      this.subscription.add(subscription);
      this.slideForm.addControl(name, formGroup);
    })
  }

  loadPrev() {
    console.log('Prev');
    this.hideKeyboard();
    this.loadSlide(false);
	}
	
	loadNext() {    
    console.log('Next');
    this.hideKeyboard();
    this.loadSlide(true);
  }

  public doRefresh(refresher: Refresher) {
    let currentIndex = this.slider.getActiveIndex();
    console.log("Huidige slide" + currentIndex);
    
    var today = this.speelData[currentIndex];

    return this.predictionsService
      .getData(this.user.sub, today.datum)
      .subscribe(data => {
        this.speelData[currentIndex] = data;
        this.mapVoorspellingen(data.voorspellingen);
        refresher.complete();
      });
  }

  save(prediction: any) : Observable<Object> {
    let predictionCommand = new PredictionCommand();
    predictionCommand.wedstrijdId = prediction.wedstrijdId;
    predictionCommand.thuisdoelpunten = prediction.thuisdoelpunten;
    predictionCommand.uitdoelpunten = prediction.uitdoelpunten;
    predictionCommand.thuisspelerId = prediction.thuisspelerId;
    predictionCommand.uitspelerId = prediction.uitspelerId;
    
    return this.predictionsService
      .save(this.user.sub, predictionCommand);
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

    let loading = this.loadingCtrl.create({ showBackdrop: false});
    loading.present().then(() => {    
      return this.predictionsService
        .getData(this.user.sub, today.datum)
        .finally(() => loading.dismiss())
        .subscribe(data => {
          this.speelData[currentIndex] = data;
          var newSlide = new PredictionsModel(isNext ? data.volgendeDag : data.vorigeDag);

          this.mapVoorspellingen(data.voorspellingen);
              
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
      });
  }

  getLogo(team : Team) : string {
    return "https://voetbalpoules.azureedge.net/logo/" + team.logoId + ".svg";    
  } 

  public getWeekpositie(wedstrijd: Match, weekPosities: WeekPositie[]) : WeekPositie {
    if(!weekPosities || weekPosities.length == 0)
      return;
    return weekPosities.find(x => x.hoofdCompetitieId == wedstrijd.hoofdcompetitie.id && 
      x.jaar == wedstrijd.jaar && 
      x.week == wedstrijd.week);
  } 

  public intToOrdinalNumberString(num: number): string {
    num = Math.round(num);
    let numString = num.toLocaleString(this.translate.currentLang);

    if(this.translate.currentLang === "nl")
      return numString + "e";
    
    // If the ten's place is 1, the suffix is always "th"
    // (10th, 11th, 12th, 13th, 14th, 111th, 112th, etc.)
    if (Math.floor(num / 10) % 10 === 1) {
      return numString + "th";
    }
  
    // Otherwise, the suffix depends on the one's place as follows
    // (1st, 2nd, 3rd, 4th, 21st, 22nd, etc.)
    switch (num % 10) {
      case 1: return numString + "st";
      case 2: return numString + "nd";
      case 3: return numString + "rd";
      default: return numString + "th";
    }
  }
}

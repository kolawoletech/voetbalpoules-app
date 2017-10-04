import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import 'rxjs/Rx';

import { PredictionsModel } from './predictions.model';
import { PredictionsService } from './predictions.service';


@Component({
  selector: 'predictions-page',
  templateUrl: 'predictions.html',
})
export class PredictionsPage {
  listing: PredictionsModel = new PredictionsModel();
  loading: any;

  constructor(
    public nav: NavController,
    public predictionsService: PredictionsService,
    public loadingCtrl: LoadingController
  ) {
    this.loading = this.loadingCtrl.create();
  }


  ionViewDidLoad() {
    this.loading.present();
    this.predictionsService
      .getData(9)
      .then(data => {
        this.listing.voorspellingen = data.voorspellingen;
        this.loading.dismiss();
      });
  }

}

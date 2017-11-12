import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { PredictionsModel } from './predictions.model';

@Injectable()
export class PredictionsService {
  constructor(public http: Http) {}

  getData(userId: number, date?: Date): Promise<PredictionsModel> {
    return this.http.get('https://api.voetbalpoules.nl/deelnemer/' + userId + '/voorspellingen/get')
     .toPromise()
     .then(response => response.json() as PredictionsModel)
     .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}

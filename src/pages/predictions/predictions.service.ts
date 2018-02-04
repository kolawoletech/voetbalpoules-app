import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PredictionsModel } from './predictions.model';

@Injectable()
export class PredictionsService {
  url: string = 'https://api.voetbalpoules.nl';
  constructor(private http: HttpClient) {}

  public getData(userId: number, date?: Date) : Observable<PredictionsModel> {
    console.log("predictions for " + userId);
    return this.http.get<PredictionsModel>(this.url + '/deelnemer/' + userId + '/voorspellingen/get');
  }
}

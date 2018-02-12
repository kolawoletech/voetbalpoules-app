import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PredictionsModel } from './predictions.model';

@Injectable()
export class PredictionsService {
  //url: string = 'https://api.voetbalpoules.nl';
  url: string = 'http://localhost:49939';
  constructor(private http: HttpClient) {}

  public getData(userId: number, date?: Date) : Observable<PredictionsModel> {
    console.log("predictions for " + userId);
    let uri = this.url + '/deelnemer/' + userId + '/voorspellingen/get';
    if(date)
    {
      uri += '?datum=' + date;
    }
    console.log(uri);
    return this.http.get<PredictionsModel>(uri);
  }
}

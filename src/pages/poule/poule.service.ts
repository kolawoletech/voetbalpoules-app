import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PouleStandUser } from './poule.model';

@Injectable()
export class PouleService {
  url: string = 'https://api.voetbalpoules.nl';
  //url: string = 'http://localhost:49939';
  constructor(private http: HttpClient) {}

  public getStand(pouleId: number, competitieId: number) : Observable<PouleStandUser[]> {
    console.log("poule " + pouleId);
    let uri = this.url + '/poule/' + pouleId + '?competitieId=' + competitieId;
    console.log(uri);
    return this.http.get<PouleStandUser[]>(uri);
  }
}

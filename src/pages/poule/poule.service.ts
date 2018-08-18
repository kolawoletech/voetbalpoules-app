import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PouleStandUser } from './poule.model';
import { SettingsService } from '../../providers/settings.service';

@Injectable()
export class PouleService {
  constructor(private http: HttpClient, private settings: SettingsService) {}

  public getStand(pouleId: number, competitieId: number) : Observable<PouleStandUser[]> {
    console.log("poule " + pouleId);
    let uri = this.settings.PouleApiEndpoint + '/poule/' + pouleId + '?competitieId=' + competitieId;
    console.log(uri);
    return this.http.get<PouleStandUser[]>(uri);
  }
}

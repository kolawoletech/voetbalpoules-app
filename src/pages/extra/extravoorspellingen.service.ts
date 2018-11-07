import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SettingsService } from '../../providers/settings.service';
import { ExtraVoorspellingen } from './extravoorspellingen.model';
import { Competition } from '../predictions/predictions.model';

@Injectable()
export class ExtraVoorspellingenService {
  
  constructor(private http: HttpClient, private settings: SettingsService) {}

  public get(userId: number, competitieId: number) : Observable<ExtraVoorspellingen> {
    let uri = this.settings.PouleApiEndpoint + '/deelnemer/' + userId + '/extra';
    if(competitieId)
        uri += '?hoofdcompetitieid=' + competitieId;
    console.log(uri);
    return this.http.get<ExtraVoorspellingen>(uri);
  }

  public getCompetities(userId: number) : Observable<Competition[]> {
    let uri = this.settings.PouleApiEndpoint + '/deelnemer/' + userId + '/competities';
    console.log(uri);
    return this.http.get<Competition[]>(uri);    
  }
}

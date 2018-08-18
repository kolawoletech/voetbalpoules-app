import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PouleModel } from './poules.model';
import { SettingsService } from '../../providers/settings.service';

@Injectable()
export class PoulesService {
  constructor(private http: HttpClient, private settings: SettingsService) {}

  public getData(userId: number) : Observable<PouleModel[]> {
    console.log("poules for " + userId);
    let uri = this.settings.PouleApiEndpoint + '/deelnemer/' + userId + '/poules';
    console.log(uri);
    return this.http.get<PouleModel[]>(uri);
  }
}

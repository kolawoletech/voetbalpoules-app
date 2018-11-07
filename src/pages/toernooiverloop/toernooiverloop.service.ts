import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Toernooiverloop } from './toernooiverloop.model';
import { SettingsService } from '../../providers/settings.service';

@Injectable()
export class ToernooiverloopService {
  
  constructor(private http: HttpClient, private settings: SettingsService) {}

  public get() : Observable<Toernooiverloop> {
    let uri = this.settings.PouleApiEndpoint + '/toernooiverloop';
    console.log(uri);
    return this.http.get<Toernooiverloop>(uri);
  }
}

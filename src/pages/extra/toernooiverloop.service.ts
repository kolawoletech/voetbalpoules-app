import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Toernooiverloop } from './toernooiverloop.model';

@Injectable()
export class ToernooiverloopService {
  url: string = 'https://api.voetbalpoules.nl';
  //url: string = 'http://localhost:49939';
  
  constructor(private http: HttpClient) {}

  public get() : Observable<Toernooiverloop> {
    let uri = this.url + '/toernooiverloop';
    console.log(uri);
    return this.http.get<Toernooiverloop>(uri);
  }
}

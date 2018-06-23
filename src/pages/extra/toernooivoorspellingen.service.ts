import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToernooiverloopVoorspellingen } from './toernooivoorspellingen.model';

@Injectable()
export class ToernooivoorspellingenService {
  url: string = 'https://api.voetbalpoules.nl';
  //url: string = 'http://localhost:49939';
  
  constructor(private http: HttpClient) {}

  public get(userId: number) : Observable<ToernooiverloopVoorspellingen> {
    let uri = this.url + '/deelnemer/' + userId + '/toernooivoorspellingen';
    console.log(uri);
    return this.http.get<ToernooiverloopVoorspellingen>(uri);
  }
}

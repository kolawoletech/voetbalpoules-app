import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PouleModel } from './poules.model';

@Injectable()
export class PoulesService {
  url: string = 'https://api.voetbalpoules.nl';
  //url: string = 'http://localhost:49939';
  constructor(private http: HttpClient) {}

  public getData(userId: number) : Observable<PouleModel[]> {
    console.log("poules for " + userId);
    let uri = this.url + '/deelnemer/' + userId + '/poules';
    console.log(uri);
    return this.http.get<PouleModel[]>(uri);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { PredictionsModel, PredictionCommand, ValidationResult } from './predictions.model';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../providers/auth/auth.service';
import { SettingsService } from '../../providers/settings.service';

@Injectable()
export class PredictionsService {
  constructor(private http: HttpClient, private authService: AuthService, private settings: SettingsService) {}

  public getData(userId: number, date?: Date) : Observable<PredictionsModel> {
    console.log("predictions for " + userId);    
    let uri = this.settings.PouleApiEndpoint + '/deelnemer/' + userId + '/voorspellingen';
    if(this.authService.user.sub === userId)
      uri += "/my";
    if(date)
    {
      uri += '?datum=' + date;
    }
    console.log(uri);
    return this.http.get<PredictionsModel>(uri)
      .catch((error: any) => {
        return Observable.throw("OEI_OFFLINE");
      });
}

  public save(userId: number, prediction: PredictionCommand): Observable<Object> {    
    let uri = this.settings.PouleApiEndpoint + '/deelnemer/' + userId + '/voorspellingen';
    //return this.http.post<PredictionCommandResponse>(uri, prediction)
    return this.http.post(uri, prediction, { responseType: 'text' }) //bug met lege response
      .pipe(
        tap(data => console.log('saved!')),
        catchError(this.handleError)
      );
  }
  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      if(error.status != 200)
      {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
        var validationResult: ValidationResult;
        try {
          validationResult = JSON.parse(error.error);
        } catch (error) {
          validationResult = new ValidationResult("VOORSPELLING_NIET_OPGESLAGEN");                    
        }
        return new ErrorObservable(validationResult);        
      }
    }
  };
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CreateUserCommand } from './signup.model';
import { ValidationResult, Competition } from '../predictions/predictions.model';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { AuthService } from '../../providers/auth/auth.service';
import { SettingsService } from '../../providers/settings.service';

@Injectable()
export class SignupService {
  constructor(private http: HttpClient, public authService: AuthService, private settings: SettingsService) {}

  public SignUp(user: CreateUserCommand) : Observable<Object> {
    console.log("user " + user.naam);
    let uri = this.settings.AuthorizationApiEndpoint + '/user';
    console.log(uri);
    return this.http.post(uri, user, { responseType: 'text' }) //bug met lege response
      .pipe(
        tap(data => console.log('saved!')),
        catchError(this.handleError)
      );    
  }

  public getCompetities() : Observable<Competition[]> {
    let uri = this.settings.PouleApiEndpoint + '/competities';
    console.log(uri);
    return this.http.get<Competition[]>(uri);    
  }

  public saveCompetities(competities: Competition[]) : Observable<boolean> {
    let uri = this.settings.PouleApiEndpoint + '/deelnemer/' + this.authService.user.sub + '/competities';
    console.log(uri);
    const competitieIds = competities.map(({ id }) => id);
    return this.http.post(uri, competitieIds, { observe: 'response', responseType: 'text' }) //bug met lege response
      .map((res: HttpResponse<string>) => {
        return true;
      })
      .catch((error: any) => {
        return this.handleError(error);
      });
  }

  private handleError(error: HttpErrorResponse) {
    var validationResult: ValidationResult;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      if(error.status === 304)
      {
        validationResult = new ValidationResult("MINIMAAL_1_COMPETITIE");
      }
      else if(error.status != 200)
      {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
        try {
          validationResult = JSON.parse(error.error);
        } catch (error) {
          validationResult = new ValidationResult("NIET_AANGEMELD");
        }
      }
      return new ErrorObservable(validationResult);        
    }
  };
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CreateUserCommand } from './signup.model';
import { ValidationResult } from '../predictions/predictions.model';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class SignupService {
  //url: string = 'https://auth.voetbalpoules.nl';
  url: string = 'http://localhost:5000';
  constructor(private http: HttpClient) {}

  public SignUp(user: CreateUserCommand) : Observable<Object> {
    console.log("user " + user.naam);
    let uri = this.url + '/user';
    console.log(uri);
    return this.http.post(uri, user, { responseType: 'text' }) //bug met lege response
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
          validationResult = new ValidationResult();
          validationResult.message = "VOORSPELLING_NIET_OPGESLAGEN";                    
        }
        return new ErrorObservable(validationResult);        
      }
    }
  };
}

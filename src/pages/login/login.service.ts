import { Injectable } from "@angular/core";
import { NativeStorage } from '@ionic-native/native-storage';
import { AuthService } from "../../providers/auth/auth.service";

@Injectable()
export class LoginService {

  constructor(
    public auth: AuthService,
    public nativeStorage: NativeStorage
  ){
  }

  doLogin(email: string, password: string) : boolean
  {
    var bla = this.auth.login(email, password);
    return true;
  }

  getFacebookUser()
  {
    return this.nativeStorage.getItem('facebook_user');
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    var foutje = error.json();
    return Promise.reject(foutje.error_description || error);
  }

}

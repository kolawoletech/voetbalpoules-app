import { Injectable } from "@angular/core";
import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class LoginService {

  constructor(
    public nativeStorage: NativeStorage
  ){
  }

  getFacebookUser()
  {
    return this.nativeStorage.getItem('facebook_user');
  }
}

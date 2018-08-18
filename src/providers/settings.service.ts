import { IsDebug } from '@ionic-native/is-debug';

export class SettingsService {
    public AuthorizationApiEndpoint: string;
    public PouleApiEndpoint: string;
    public LogoEndpoint: string;

    constructor() { //private isDebug: IsDebug) { 
        //this.isDebug.getIsDebug()
        //    .then((isDebug: boolean) => {
        //        if(isDebug) {
        //            console.log('Debug mode!');
                    // this.AuthorizationApiEndpoint = 'https://localhost:44366';
                    // this.PouleApiEndpoint = 'https://localhost:44396';
                    // this.LogoEndpoint = 'https://localhost:44300/foto';
        //        }
        //        else {
                   this.AuthorizationApiEndpoint = 'https://auth.voetbalpoules.nl';
                   this.PouleApiEndpoint = 'https://api.voetbalpoules.nl';
                   this.LogoEndpoint = 'https://vp-logos.azureedge.net';
        //        }        
        //    });          
    }
}
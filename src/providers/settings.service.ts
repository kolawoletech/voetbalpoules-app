import { IsDebug } from '@ionic-native/is-debug';
import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {
    public AuthorizationApiEndpoint: string = 'https://auth.voetbalpoules.nl'; //https://localhost:44366';
    public PouleApiEndpoint: string = 'https://api.voetbalpoules.nl'; //https://localhost:44396';
    public LogoEndpoint: string = 'https://vp-logos.azureedge.net'; //https://localhost:44300/foto';

    constructor(private isDebug: IsDebug) { 
        this.isDebug.getIsDebug()
            .then((isDebug: boolean) => {
                if(!isDebug) {
                    this.AuthorizationApiEndpoint = 'https://auth.voetbalpoules.nl';
                    this.PouleApiEndpoint = 'https://api.voetbalpoules.nl';
                    this.LogoEndpoint = 'https://vp-logos.azureedge.net';
                }        
            });          
    }
}
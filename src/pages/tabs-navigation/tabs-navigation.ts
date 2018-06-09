import { Component } from '@angular/core';

import { PredictionsPage } from '../predictions/predictions';
import { PoulesPage } from '../mijn/poules';
import { SettingsPage } from '../settings/settings';
import { ExtraPage} from '../extra/extra';

@Component({
  selector: 'tabs-navigation',
  templateUrl: 'tabs-navigation.html'
})
export class TabsNavigationPage {
  tab1Root: any;
  tab2Root: any;
  tab3Root: any;
  tab4Root: any;
  
  constructor() {
    this.tab1Root = PredictionsPage;
    this.tab2Root = ExtraPage;
    this.tab3Root = PoulesPage;
    this.tab4Root = SettingsPage;
  }
}

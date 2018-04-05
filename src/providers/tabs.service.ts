import {Injectable} from '@angular/core';

// Declare TabsService as a provider in app.module.ts
// Inject TabsService in your class: constructor(public tabs: TabsService){}
// Use the this.tabs.hide() or this.tabs.show() methods wherever you want
@Injectable()

export class TabsService {
  initialDisplayValue: { [key: string]: string } = {};
  initalMarginBottom: { [key: string]: string } = {};
  initialBottom: { [key: string]: string } = {};

  constructor() {}

  public hide() {
    let tabs = document.querySelectorAll('.tabbar');
    let footer = document.querySelectorAll('.footer');
    let scrollContent = document.querySelectorAll('.scroll-content');
    if (tabs !== null) {
      Object.keys(tabs).map((key) => {
        if(this.initialDisplayValue[key] == null)
          this.initialDisplayValue[key] = tabs[key].style.display;
        tabs[key].style.display = 'none';
      });

      // fix for removing the margin if you got scorllable content
      setTimeout(() =>{
        Object.keys(scrollContent).map((key) => {
          if(this.initalMarginBottom[key] == null)
            this.initalMarginBottom[key] = scrollContent[key].style.marginBottom;
          scrollContent[key].style.marginBottom = '0';
        });
        Object.keys(footer).map((key) => {
          if(this.initialBottom[key] == null)
            this.initialBottom[key] = footer[key].style.bottom
          footer[key].style.bottom = '0px';
        });
      })
    }
  }

  public show() {
    let tabs = document.querySelectorAll('.tabbar');
    let footer = document.querySelectorAll('.footer');
    let scrollContent = document.querySelectorAll('.scroll-content');

    if (tabs !== null) {
      Object.keys(tabs).map((key) => {
        if(this.initialDisplayValue[key] != null)
          tabs[key].style.display = this.initialDisplayValue[key];
      });

      setTimeout(() =>{
        Object.keys(scrollContent).map((key) => {
          if(this.initalMarginBottom[key] != null)
            scrollContent[key].style.marginBottom = this.initalMarginBottom[key];
        });
        Object.keys(footer).map((key) => {
          if(this.initialBottom[key] != null)
            footer[key].style.bottom = this.initialBottom[key];
        });
      })
    }
  }
}
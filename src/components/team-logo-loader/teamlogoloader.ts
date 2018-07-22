// An image directive based on http://blog.teamtreehouse.com/learn-asynchronous-image-loading-javascript
import {Directive, Input, OnInit} from '@angular/core';
import { Team } from '../../pages/predictions/predictions.model';
//import { File } from '@ionic-native/file';

// Define the Directive meta data
@Directive({
  selector: '[team-logo]', //E.g <img mg-img-preloader="http://some_remote_image_url"
  host: {
    '[attr.src]': 'finalImage'    //the attribute of the host element we want to update. in this case, <img 'src' />
  }
})

//Class must implement OnInit for @Input()
export class TeamLogoLoader implements OnInit {
//  targetSource: string;
  @Input('team-logo') team: Team;

//  downloadingImage : any; // In class holder of remote image
  finalImage: any; //property bound to our host attribute.

  // Set an input so the directive can set a default image.
  @Input() defaultImage : string = 'assets/images/logo.png';

  //constructor(public file: File) {}

  //ngOnInit is needed to access the @inputs() variables. these aren't available on constructor()
  ngOnInit() {
    this.finalImage = this.getLogo(this.team);
    // this.finalImage = "assets/logo/" + this.team.logoId + ".svg";// this.defaultImage;
    // this.downloadingImage = new Image();  // create image object
    // this.downloadingImage.onload = () => { //Once image is completed, console.log confirmation and switch our host attribute
    //   //debugger;
    //   this.file.checkFile("assets/logo/", this.team.logoId + ".svg")
    //     .then(exists => {
    //       debugger;
    //       if(!exists) {
    //         console.log('image downloaded');
    //         this.finalImage = this.getLogo(this.team);
    //         //this.finalImage = this.targetSource;  //do the switch 😀      
    //       }
    //       else {
    //         console.log("geen laden");
    //         this.finalImage = "assets/logo/" + this.team.logoId + ".svg";
    //         //this.finalImage = this.targetSource;  //do the switch 😀      
    //       }
    //     });
      
    // }
    // // Assign the src to that of some_remote_image_url. Since its an Image Object the
    // // on assignment from this.targetSource download would start immediately in the background
    // // and trigger the onload()
    // this.downloadingImage.src = this.targetSource;
  }

  // logoExists(team: Team) : Promise<boolean> {
  //   return this.file.checkFile("assets/logo/", team.logoId + ".svg");
  // }

  getLogo(team : Team) : string {
    return "https://vp-logos.azureedge.net/" + team.logoId;    
  } 

}
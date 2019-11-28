import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-profile-popover',
  templateUrl: './profile-popover.component.html',
  styleUrls: ['./profile-popover.component.scss'],
})
export class ProfilePopoverComponent implements OnInit {

  image : any;
  bgcolor: any = '#fff';
  textcolor: any = '#000';

  constructor( public popoverCtrl : PopoverController,
               public navParams   : NavParams) { }

  ngOnInit() {
    this.image = this.navParams.data.image;
    console.log(this.image);
  }

  closeHomePopover() {
    this.popoverCtrl.dismiss();
  }

}

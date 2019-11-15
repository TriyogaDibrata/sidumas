import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-image-popover',
  templateUrl: './image-popover.component.html',
  styleUrls: ['./image-popover.component.scss'],
})
export class ImagePopoverComponent implements OnInit {

  bgcolor: any = '#fff';
  textcolor: any = '#000';

  @Input() url;

  constructor(
    public popoverCtrl      : PopoverController,
  ) { }

  ngOnInit() {    
  }

  closeHomePopover() {
    this.popoverCtrl.dismiss();
  }

}

import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-home-popover',
  templateUrl: './home-popover.component.html',
  styleUrls: ['./home-popover.component.scss'],
})
export class HomePopoverComponent implements OnInit {

  url: any = null;
  bgcolor: any = '#fff';

  constructor(
    public popoverCtrl      : PopoverController,
    private sharedService   : SharedService,
  ) { }

  ngOnInit() {
    this.getBanners();
  }

  closeHomePopover() {
    this.popoverCtrl.dismiss();
  }

  getBanners(){
    if(this.sharedService.banners.get == 0){
      this.sharedService.getBanners()
      .subscribe(data => {
        this.sharedService.banners.get = 1;
        this.sharedService.banners = data;

        this.url = this.sharedService.banners.popover.url;
        this.bgcolor = this.sharedService.banners.popover.bgcolor;
      });
    }else{
      this.url = this.sharedService.banners.popover.url;
      this.bgcolor = this.sharedService.banners.popover.bgcolor;
    }
  }
}

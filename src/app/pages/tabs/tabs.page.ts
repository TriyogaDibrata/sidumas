import { Component } from '@angular/core';
import { SharedService } from 'src/app/services/shared/shared.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  user_type: any;

  constructor(public sharedService: SharedService,
    public platform     : Platform,
    public router       : Router,
    public alertService : AlertService,
  ) {

  }

  ionViewWillEnter() {
    // this.getUser();
  }

  getUser() {
    this.sharedService.getUser()
      .subscribe(data => {
        this.user_type = data['tipe'];
      })
  }

}

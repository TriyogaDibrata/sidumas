import { Component } from '@angular/core';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  user_type : any;

  constructor(private sharedService       : SharedService) {}

  ionViewWillEnter(){
    // this.getUser();
  }

  getUser(){
    this.sharedService.getUser()
    .subscribe(data => {
      this.user_type = data['tipe'];
    })
  }

}

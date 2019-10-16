import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared/shared.service';
import { EnvService } from 'src/app/services/env/env.service';
import { AuthService } from 'src/app/services/auht/auth.service';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common/common.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  lists : any;
  user  : any = {};

  constructor(
    private sharedService   : SharedService,
    private env             : EnvService,
    private authService     : AuthService,
    public commonService    : CommonService,
    public alertCtrl        : AlertController,
  ) { }

  ngOnInit() {

  }

  seeDetail(id){
    this.commonService.goForward(['detail-laporan/', id]);
  }

  ionViewWillEnter(){
    this.getListPengaduan();
    this.getUser();
  }

  getListPengaduan(){
    this.sharedService.getListPengaduan()
    .subscribe(data => {
      console.log(data['data']);
      this.lists = data['data'];
    });
  }

  converTime(time) {
    moment.locale('id')
    let local_time = moment(time).fromNow();
    return local_time;
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Perhatian!',
      message: 'Apakah anda yakin ingin keluar ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  logout(){
    this.authService.logout();
  }

  getUser(){
    this.user = this.sharedService.getUserCache();
  }
}

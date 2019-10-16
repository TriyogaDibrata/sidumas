import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared/shared.service';
import { EnvService } from 'src/app/services/env/env.service';
import { AuthService } from 'src/app/services/auht/auth.service';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common/common.service';
import { AlertController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  lists       : any;
  user        : any = {};
  color_vote  : any;

  constructor(
    private sharedService   : SharedService,
    private env             : EnvService,
    private authService     : AuthService,
    public commonService    : CommonService,
    public alertCtrl        : AlertController,
    private alertService    : AlertService,
  ) {
   }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.getListPengaduan();
    this.getUser();
  }

  seeDetail(id){
    this.commonService.goForward(['detail-laporan/', id]);
  }

  getListPengaduan(){
    this.sharedService.getListPengaduan()
    .subscribe(data => {
      this.lists = data['data'];
    });
  }

  doRefresh(event){
    this.sharedService.getListPengaduan()
    .subscribe(data => {
      this.lists = data['data'];
      event.target.complete();
    }, err => {
      this.alertService.presentAlert('Terjadi Kesalahan', 'Tidak dapat memuat data');
    })
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
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ya',
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
    this.sharedService.getUser()
    .subscribe(data => {
      this.user = data;
    }, err => {
    this.alertService.presentAlert('Terjadi Kesalahan', 'Tidak dapat mengambil data pengguna');
    });
  }

  addVote(pengaduan_id){
    let data = {
      'user_id'     : this.user['id'],
      'pengaduan_id': pengaduan_id,
    }

    this.sharedService.addVote(data)
    .subscribe(data => {
      if(data['success']){
        this.ionViewDidEnter();
      } else {
        this.alertService.presentAlert('Gagal Menyimpan Data', 'Terjadi kesalahan saat menyimpan data');
      }
    }, err => {
        this.alertService.presentAlert('Gagal Menyimpan Data', 'Terjadi kesalahan saat menyimpan data');
    });
  }

  

}
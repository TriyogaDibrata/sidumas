import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared/shared.service';
import { EnvService } from 'src/app/services/env/env.service';
import { AuthService } from 'src/app/services/auht/auth.service';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common/common.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  lists       : any = [];
  user        : any = {};
  color_vote  : any;
  categories  : any;
  loading   : any;
  category    : any = "";

  constructor(
    private sharedService   : SharedService,
    private env             : EnvService,
    private authService     : AuthService,
    public commonService    : CommonService,
    public alertCtrl        : AlertController,
    private alertService    : AlertService,
    public loadingCtrl      : LoadingController,
  ) {
   }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.category = "";
    this.getMenuCategories();
    this.getUser();
    this.getListPengaduan();
  }

  seeDetail(id){
    this.commonService.goForward(['detail-laporan/', id]);
  }

  getListPengaduan(){
    this.showLoading();
    this.sharedService.getListPengaduan(this.category)
    .subscribe(data => {
      this.lists = data['data'];
      this.loading.dismiss();
    });
  }

  getMenuCategories(){
    this.sharedService.getMenuCategories()
    .subscribe(data => {
      this.categories = data;
    });
  }

  doRefresh(event){
    this.sharedService.getListPengaduan(this.category)
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
    this.user = this.sharedService.getUserCache();
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

  segmentChanged(ev: any){
    this.category = ev.detail.value;
    this.getListPengaduan();
  }

  async showLoading(){
    this.loading = await this.loadingCtrl.create({
      spinner : "dots",
      backdropDismiss : true,
      message : "Loading..."
    });

    await this.loading.present();
  }
}

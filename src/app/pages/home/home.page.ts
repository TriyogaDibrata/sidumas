import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/services/shared/shared.service';
import { EnvService } from 'src/app/services/env/env.service';
import { AuthService } from 'src/app/services/auht/auth.service';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common/common.service';
import { IonInfiniteScroll, AlertController, LoadingController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;

  lists       : any = [];
  user        : any = {};
  color_vote  : any;
  categories  : any = [];
  loading     : any;
  category    : any = "";
  search      : any = {active: 0,limit: 30,value: ''};
  iScroll  : any = {enable: 1, page: 0};
  slideOpts = {
    initialSlide: 0,
    autoplay: {
      delay: 3000,
    },
    speed: 400
  };
  banners  : any = [];

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
    this.lists = [];
    this.iScroll.page = 0;
    this.getBanners();
    this.getMenuCategories();
    this.getUser();
    this.getListPengaduan();
  }

  seeDetail(id){
    this.commonService.goForward(['detail-laporan/', id]);
  }

  getListPengaduan(){
    this.showLoading();
    this.sharedService.getListPengaduan(this.category, this.search.value, this.iScroll.page)
    .subscribe(data => {
      this.lists = data['data'];
      this.loading.dismiss();
    });
  }

  getMenuCategories(){
    if(this.categories.length == 0){
      this.sharedService.getMenuCategories()
      .subscribe(data => {
        this.categories = data;
      });
    }
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

    this.iScroll.page = 0;
    this.iScroll.enable = 1;
  }

  toogleSearch(){
    if(this.search.active==1){
      this.search.active = 0;
      this.search.value = '';
      this.getListPengaduan();
    }else{
      this.search.active = 1;
    }
  }

  loadData(event){
    if(this.iScroll.enable) {
      this.iScroll.page++;

      this.sharedService.getListPengaduan(this.category, this.search.value, this.iScroll.page)
      .subscribe((data) => {
        console.log(data);
        if(data['count'] > 0){
          this.transformData(data['data']);
        }else{
          this.iScroll.enable = 0;
        }
      }, err => {
        console.log(err);
      });
    }
    event.target.complete();
  }

  transformData(rows){
    rows.forEach((data) => {
      this.lists.push(data);
    });
  }

  searchPengaduan(ev){
    this.getListPengaduan();
  }

  writeSearch(ev){
    if (ev.target.value.length > this.search.limit) {
      ev.target.value = this.search.value;
      return false;
    }
    this.search.value = ev.target.value;
  }

  async showLoading(){
    this.loading = await this.loadingCtrl.create({
      spinner : "dots",
      backdropDismiss : true,
      message : "Loading..."
    });

    await this.loading.present();
  }

  getBanners(){
    this.banners = this.sharedService.getBanners();
  }
}

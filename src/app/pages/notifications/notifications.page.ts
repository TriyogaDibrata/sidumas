import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/services/shared/shared.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;

  notifs  : any = [];
  page: number;
  lastMonth: number;
  infiniteScrollEnable: number;
  loading   : any;
  user  : any = {};

  constructor(
    private sharedService   : SharedService,
    public commonService    : CommonService,
    public loadingCtrl      : LoadingController,
    public alertCtrl        : AlertController,
    public alertService     : AlertService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.showLoading();
    this.notifs = [];
    this.page = this.lastMonth = 0;
    this.infiniteScrollEnable = 1;
    this.getUser();
  }

  firstNotifs(id){
    this.sharedService.getNotifs(id, this.page, 1)
    .subscribe((data: any[]) => {
      if(data.length > 0){
        this.transformData(data);
      }
      this.sharedService.notif.news = 0;
      this.loading.dismiss();
    }, err => {
      this.alertService.presentAlert('Gagal memuat data', 'Terdapat kesalahan saat memuat data');
    });
  }

  doRefresh(event){
    this.page = this.lastMonth = 0;
    this.sharedService.getNotifs(this.user.id, this.page, 1)
    .subscribe((data: any[]) => {
      this.notifs = [];
      this.infiniteScrollEnable = 1;
      if(data.length > 0){
        this.transformData(data);
      }
      this.sharedService.notif.news = 0;
      this.loading.dismiss();
      event.target.complete();
    }, err => {
      event.target.complete();
      this.alertService.presentAlert('Gagal memuat data', 'Terdapat kesalahan saat memuat data');
    });
  }

  nextPage(event){
    if(this.infiniteScrollEnable) {
      this.page++;
      this.sharedService.getNotifs(this.user.id, this.page)
      .subscribe((data: any[]) => {
        if(data.length > 0){
          this.transformData(data);
        }else{
          this.infiniteScrollEnable = 0;
        }
        event.target.complete();
      }, err => {
        console.log(err);
      });
    }else{
      event.target.complete();
    }
  }

  transformData(rows){
    moment.locale('id');

    rows.forEach((data) => {
      let date = moment(data.created_at, 'YYYY-MM-DD HH:mm:ss');

      data.mmmmyy = date.format('MMMM YY');
      data.ddmmm = date.format('DD MMM');
      data.group = 0;
      if(this.lastMonth != date.month()){
        data.group = 1;
        this.lastMonth = date.month();
      }

      data.title = this.capitalizeFirstLetter(data.title);      

      this.notifs.push(data);
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getUser(){
    this.user = this.sharedService.getUserCache();
    this.firstNotifs(this.user.id);
  }

  async showLoading(){
    this.loading = await this.loadingCtrl.create(this.sharedService.loadingOption);

    await this.loading.present();
  }

  redirectTo(page){
    if(page != null) {
      this.commonService.goForward(page);
    }
  }
}

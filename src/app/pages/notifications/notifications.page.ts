import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/services/shared/shared.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  notifs  : any = [];
  page: number;
  lastMonth: number;
  infiniteScroll: number;
  loading   : any;
  user  : any = {};

  constructor(
    private sharedService   : SharedService,
    public commonService    : CommonService,
    public loadingCtrl  : LoadingController,
    public alertCtrl        : AlertController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.showLoading();
    this.notifs = [];
    this.page = this.lastMonth = 0;
    this.infiniteScroll = 1;
    this.getUser();
  }

  firstNotifs(id){
    this.sharedService.getNotifs(id, this.page, 1)
    .subscribe(data => {
      if(data.count>0){
        this.transformData(data.data);
      }
      this.sharedService.new_notif = 0;
      this.loading.dismiss();
    }, err => {
      console.log(err);
    });
  }

  nextPage(event){
    if(this.infiniteScroll) {
      this.page++;
      this.sharedService.getNotifs(this.user.id, this.page)
      .subscribe(data => {
        if(data.count>0){
          this.transformData(data.data);
        }else{
          this.infiniteScroll = 0;
        }
      }, err => {
        console.log(err);
      });
    }
    event.target.complete();
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

      this.notifs.push(data);
    });
  }

  getUser(){
    this.user = this.sharedService.getUserCache();    
    this.firstNotifs(this.user.id);
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

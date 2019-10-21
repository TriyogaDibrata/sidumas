import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from 'src/app/services/shared/shared.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common/common.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  user        : any;
  lists       : any = [];
  segment     : any = {value: 1};
  infiniteScroll  : any = {enable: 1, page: 0};
  loading     : any;

  constructor(private sharedService : SharedService,
              private alertService  : AlertService,
              private commonService : CommonService,
              public loadingCtrl    : LoadingController,
              ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getUser();
    this.showLoading();
  }

  seeDetail(id){
    this.commonService.goForward(['detail-laporan/', id]);
  }

  getUser(){
    this.sharedService.getUser()
    .subscribe(data => {
      this.user = data;
      this.getMyList(this.user['id']);
    }, err => {
      console.log(err);
    });
  }

  getMyList(user_id){
    this.sharedService.myList(user_id, this.segment.value, this.infiniteScroll.page)
    .subscribe(data => {
      console.log(data);
      this.lists = data['data'];
      this.loading.dismiss();
    }, err => {
      console.log(err);
      this.loading.dismiss();
    });
  }

  converTime(time) {
    moment.locale('id')
    let local_time = moment(time).fromNow();
    return local_time;
  }

  segmentChanged(ev: any) {
    this.segment.value = ev.detail.value;

    // reset infinite scroll
    this.infiniteScroll.page = 0;
    this.infiniteScroll.enable = 1;

    this.getMyList(this.user['id']);
  }

  nextPage(event){
    if(this.infiniteScroll.enable) {
      this.infiniteScroll.page++;

      this.sharedService.myList(this.user['id'], this.segment.value, this.infiniteScroll.page)
      .subscribe((data) => {
        console.log(data);
        if(data['count'] > 0){
          this.transformData(data['data']);
        }else{
          this.infiniteScroll.enable = 0;
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

  async showLoading(){
    this.loading = await this.loadingCtrl.create({
      spinner : "dots",
      backdropDismiss : true,
      message : "Loading..."
    });

    await this.loading.present();
  }
}

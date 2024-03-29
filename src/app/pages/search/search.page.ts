import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from 'src/app/services/shared/shared.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common/common.service';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;

  user        : any = {};
  lists       : any = [];
  segment     : any = {value: 1};
  iScroll     : any = {enable: 1, page: 0};
  loading     : any;

  constructor(public sharedService  : SharedService,
              private alertService  : AlertService,
              private commonService : CommonService,
              public loadingCtrl    : LoadingController,
              ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.showLoading();
    this.lists = [];
    this.iScroll.enable = 1;
    this.iScroll.page = 0;
    this.getUser();
  }

  getUser(){
    this.sharedService.getUser()
    .subscribe(data => {
      this.user = data;
      this.getMyList(this.user['id']);
    }, err => {
      this.commonService.presentAlert('Gagal memuat', 'Terjadi kesalahan saat memuat data');
    });
  }

  getMyList(user_id){
    this.sharedService.myList(user_id, this.segment.value, this.iScroll.page)
    .subscribe(data => {
      console.log(data);
      this.lists = data['data'];
      this.loading.dismiss();
    }, err => {
      this.commonService.presentAlert('Gagal memuat', 'Terjadi kesalahan saat memuat data');
      this.loading.dismiss();
    });
  }

  doRefresh(event){
    this.showLoading();
    this.iScroll.page = 0;
    this.iScroll.enable = 1;
    this.sharedService.myList(this.user['id'], this.segment.value, this.iScroll.page)
    .subscribe(data => {
      this.lists = data['data'];
      event.target.complete();
      this.loading.dismiss();
    }, err => {
      this.alertService.presentAlert('Terjadi Kesalahan', 'Tidak dapat memuat data');
      this.loading.dismiss();
    })
  }

  converTime(time) {
    moment.locale('id')
    let local_time = moment(time).fromNow();
    return local_time;
  }

  segmentChanged(ev: any) {
    this.showLoading();
    this.segment.value = ev.detail.value;

    // reset infinite scroll
    this.iScroll.page = 0;
    this.iScroll.enable = 1;

    this.getMyList(this.user['id']);
  }

  nextPage(event){
    if(this.iScroll.enable) {
      this.iScroll.page++;

      this.sharedService.myList(this.user['id'], this.segment.value, this.iScroll.page)
      .subscribe((data) => {
        if(data['count'] > 0){
          this.transformData(data['data']);
        }else{
          this.iScroll.enable = 0;
        }
        event.target.complete();
      }, err => {
        this.commonService.presentAlert('Gagal memuat', 'Terjadi kesalahan saat memuat data');
      });
    }else{
      event.target.complete();
    }
  }

  transformData(rows){
    rows.forEach((data) => {
      this.lists.push(data);
    });
  }

  async showLoading(){
    this.loading = await this.loadingCtrl.create(this.sharedService.loadingOption);

    await this.loading.present();
  }

  voteColor(islike){
    if(islike == null ){
      return ""
    } else {
      return "danger";
    }
  }

  addVote(pengaduan){
    let data = {
      'user_id'     : this.sharedService.getUserCache().id,
      'pengaduan_id': pengaduan.id,
    }

    this.sharedService.addVote(data)
    .subscribe(data => {
      if(data['success'] && data['new_user']){
        pengaduan.likes_count++;
        pengaduan.is_like = 1;

      } else if (data['success'] && !data['new_user']){
        pengaduan.likes_count--;
        pengaduan.is_like = null;
      }else {
        this.alertService.presentAlert('Gagal Menyimpan Data', 'Terjadi kesalahan saat menyimpan data');
      }
    }, err => {
        this.alertService.presentAlert('Gagal Menyimpan Data', 'Terjadi kesalahan saat menyimpan data');
    });
  }

  seeDetail(pengaduan){
    this.sharedService.pengaduan = pengaduan;
    this.commonService.goForward(['detail-laporan/', pengaduan.id]);
  }
}

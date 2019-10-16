import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from 'src/app/services/shared/shared.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  user        : any;
  lists       : any;

  constructor(private sharedService : SharedService,
              private alertService  : AlertService,
              private commonService : CommonService
              ) { }

  ngOnInit() {
    this.getUser();
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
    this.sharedService.myList(user_id)
    .subscribe(data => {
      console.log(data);
      this.lists = data['data'];
    }, err => {
      console.log(err);
    });
  }

  converTime(time) {
    moment.locale('id')
    let local_time = moment(time).fromNow();
    return local_time;
  }

}

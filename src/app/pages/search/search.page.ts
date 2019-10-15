import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from 'src/app/services/shared/shared.service';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  user        : any;

  constructor(private sharedService : SharedService,
              private alertService  : AlertService,
              ) { }

  ngOnInit() {
  }

  getUser(){
    this.sharedService.getUser()
    .subscribe(data => {
      this.user = data;
    }, err => {
      console.log(err);
    });
  }

  get

}

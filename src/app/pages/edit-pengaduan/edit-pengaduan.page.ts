import { Component, OnInit } from '@angular/core';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-edit-pengaduan',
  templateUrl: './edit-pengaduan.page.html',
  styleUrls: ['./edit-pengaduan.page.scss'],
})
export class EditPengaduanPage implements OnInit {

  pengaduan_id    : any;
  detail          : any = {};
  files           : any;

  constructor(public route          : ActivatedRoute,
              public Router         : Router,
              public sharedService  : SharedService) { }

  ngOnInit() {
    this.pengaduan_id = this.route.snapshot.paramMap.get('id');
  }

  ionViewWillEnter(){
    this.getDetail();
  }

  getDetail(){
    this.sharedService.getDetailPengaduan(this.pengaduan_id)
    .subscribe(data =>{
      this.detail = data['data'];
      this.files = this.detail['files'];
    }, err => {
      console.log(err);
    })
  }

}

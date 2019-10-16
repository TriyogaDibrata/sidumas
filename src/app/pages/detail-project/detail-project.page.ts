import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared/shared.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-detail-project',
  templateUrl: './detail-project.page.html',
  styleUrls: ['./detail-project.page.scss'],
})
export class DetailProjectPage implements OnInit {

  project_id : any;
  user       : any;
  lists      : any;

  constructor(private sharedService     : SharedService,
              private route             : ActivatedRoute,
              public navCtrl            : NavController,
              ) { }

  ngOnInit() {
    this.project_id = this.route.snapshot.paramMap.get('id');
  }

  ionViewWillEnter(){
    this.getUser();
    this.getDetailProject();
  }

  getUser(){
    this.user = this.sharedService.getUserCache();
  }

  getDetailProject(){
    this.sharedService.detailProject(this.project_id)
    .subscribe(data => {
      console.log(data);
      this.lists = data['data'];
    });
  }

  converTime(time) {
    moment.locale('id')
    let local_time = moment(time).fromNow();
    return local_time;
  }

  seeDetail(id){
    this.navCtrl.navigateForward(['detail-laporan', id]);
  }

}

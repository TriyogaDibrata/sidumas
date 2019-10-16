import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared/shared.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {

  user  : any = {};
  project : any;

  constructor(private sharedService   : SharedService,
              private navCtrl         : NavController,
             ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getUser();
  }

  getUser(){    
    this.user = this.sharedService.getUserCache();
    this.getProject(this.user['opd_id']);
  }

  getProject(opd_id){
    this.sharedService.getProject(opd_id)
    .subscribe(data =>{
      console.log(data['data']);
      this.project = data['data'];
    });
  }

  detailProject(id) {
    this.navCtrl.navigateForward(['detail-project', id]);
  }

}

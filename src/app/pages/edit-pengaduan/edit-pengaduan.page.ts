import { Component, OnInit } from '@angular/core';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/services/shared/shared.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-edit-pengaduan',
  templateUrl: './edit-pengaduan.page.html',
  styleUrls: ['./edit-pengaduan.page.scss'],
})
export class EditPengaduanPage implements OnInit {

  pengaduan_id    : any;
  detail          : any = {};
  files           : any = [];
  categories      : any;
  loading         : any;
  hide_identitas  : boolean = false;
  hide_pengaduan  : boolean = false;

  constructor(public route          : ActivatedRoute,
              public Router         : Router,
              public sharedService  : SharedService,
              public alertService   : AlertService,
              public loadingCtrl    : LoadingController) {
                this.files = [];
               }

  ngOnInit() {
    this.pengaduan_id = this.route.snapshot.paramMap.get('id');
  }

  ionViewWillEnter(){
    this.getDetail();
    this.getKategori();
  }

  getDetail(){
    this.showLoading();
    this.sharedService.getDetailPengaduan(this.pengaduan_id)
    .subscribe(data =>{
      this.detail = data['data'];
      console.log(this.detail.hide_identitas);
      this.files = this.detail['files'];
      this.loading.dismiss();
    }, err => {
      this.loading.dismiss();
      console.log(err);
    })
  }

  getKategori(){
    this.sharedService.getAllCategory ()
    .subscribe(data =>{
      this.categories = data;
      console.log(data);
    }, err => {
      console.log(err);
    })
  }

  hide_id() {
    if (this.detail.hide_identitas == 1) {
      this.alertService.presentAlert('Rahasiakan Identitas', 'Dengan mengaktifkan fitur ini maka identitas anda akan di rahasiakan');
    } else {

    }
  }

  hide_rp() {
    if (this.detail.hide_pengaduan == 1) {
      this.alertService.presentAlert('Rahasiakan Pengaduan', 'Dengan mengaktifkan fitur ini maka pengaduan anda akan di rahasiakan');
    } else {

    }
  } 

  async showLoading(){
    this.loading = await this.loadingCtrl.create(this.sharedService.loadingOption);

    await this.loading.present();
  }

  save(){
    console.log(this.detail);
  }

  deleteFiles(file_id, pengaduan_id){
    console.log(file_id, pengaduan_id);
    this.sharedService.deleteFile(file_id, pengaduan_id)
    .subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err);
    })
  }

}

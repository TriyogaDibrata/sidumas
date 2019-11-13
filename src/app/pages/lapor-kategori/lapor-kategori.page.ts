import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/services/shared/shared.service';
import { AuthService } from 'src/app/services/auht/auth.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-lapor-kategori',
  templateUrl: './lapor-kategori.page.html',
  styleUrls: ['./lapor-kategori.page.scss'],
})
export class LaporKategoriPage implements OnInit {

  kategori  : any;
  user      : any;
  loading   : any;

  constructor(public navCtrl      : NavController,
              public router       : Router,
              public route        : ActivatedRoute,
              public sharedService: SharedService,
              private authService : AuthService,
              public loadingCtrl  : LoadingController,
              public alertService : AlertService,
              private callNumber  : CallNumber,
              ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getUser();
  }

  async showLoading(){
    this.loading = await this.loadingCtrl.create(this.sharedService.loadingOption);

    await this.loading.present();
  }

  goToLapor(id, event){
    if(event == 'call_number'){
      this.callNumber.callNumber('112', true)
      .then(res => console.log('Launched Dialer', res))
      .catch(err => console.log('Error launching dialer', err))
    } else {
      this.navCtrl.navigateForward(['/lapor', id]);
    }
  }

  getKategori(){
    this.sharedService.getKategori()
    .subscribe(data => {
      this.kategori = data;
      console.log(this.kategori);
    });
  }

  getUser(){
    this.user = this.sharedService.getUserCache();
    this.checkUser(this.user['id']);
  }

  checkUser(user_id){
    this.showLoading();
    this.sharedService.checkUser(user_id)
    .subscribe(data => {
      if(!data['success']){
        this.loading.dismiss();
        this.alertService.presentAlert('Data Diri Belum Lengkap', 'Anda hanya akan bisa melapor apabila data diri anda sudah lengkap');
        this.navCtrl.navigateRoot('app/tabs/profile');
      } else {
        this.loading.dismiss();
        this.getKategori();
      }
    });
  }


}

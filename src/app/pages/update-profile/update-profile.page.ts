import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SharedService } from 'src/app/services/shared/shared.service';
import { LoadingController, NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';
import * as moment from 'moment';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage implements OnInit {

  base64Image   : any;
  photos        : any;
  user_id       : any;
  user          : any = {};
  name          : any;
  email         : any;
  bio           : any;
  no_hp         : any;
  birthday      : any;
  nik           : any;
  ktp           : any;
  verified_foto : any;
  path_ktp      : any;
  path_verified_foto : any;
  sex           : any;
  status        : any;
  loading       : any;

  constructor(private camera          : Camera,
              private sharedService   : SharedService,
              public loadingCtrl      : LoadingController,
              public navCtrl          : NavController,
              public alertService     : AlertService,
             ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getUserInformation();
  }

  async showLoading(){
    this.loading = await this.loadingCtrl.create({
      spinner : "dots",
      backdropDismiss : true,
      message : "Loading..."
    });

    await this.loading.present();
  }

  checkChange() {
    if(this.user.status==1){
        this.alertService.presentAlert('Sudah Terverifikasi', 'Informasi ini tidak dapat diubah kembali.');
        return false;
    }
    return true;
  }

  notEditableDate() {
    moment.locale('id');
    return moment(this.user.tgl_lahir).format('DD MMMM YYYY');
  }

  takePhoto(type) {
    if(this.user.status==1){
        this.alertService.presentAlert('Sudah Terverifikasi', 'Informasi ini tidak dapat diubah kembali.');
        return false;
    }

    let height = 800;
    let width = 800;

    const options: CameraOptions = {
      quality: 100, // picture quality
      targetWidth: width,
      targetHeight: height,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      sourceType: this.camera.PictureSourceType.CAMERA,
    }
    this.camera.getPicture(options).then((imageData) => {

      if(type === "user_photo"){
        this.user.verified_foto = "data:image/jpeg;base64," + imageData;
      } else {
        this.user.ktp = "data:image/jpeg;base64," + imageData;
      }
    }, (err) => {
      this.alertService.presentAlert('Gagal membuka kamera', 'Terdapat kesalahan saat membuka kamera');
    });
  }

  getUserInformation(){
    this.user = this.sharedService.getUserCache();
    console.log(this.user);
  }

  updateProfile(){
    this.showLoading();

    let data = {
      'id'            : this.user.id,
      'name'          : this.user.name,
      'description'   : this.user.description,
      'sex'           : this.user.sex,
      'no_hp'         : this.user.no_hp,
      'tgl_lahir'     : this.user.tgl_lahir,
      'nik'           : this.user.nik,
      'ktp'           : this.user.ktp,
      'foto'          : this.user.verified_foto
    }

    this.sharedService.updateProfileUser(data)
    .subscribe(data => {
        if(data['success']){
          this.loading.dismiss();
          this.navCtrl.navigateRoot('/app/tabs/profile');
          this.alertService.presentToast('Informasi berhasil diperbaharui');
          this.sharedService.getUserCache(true);
        }
    }, err => {
        this.loading.dismiss();
        this.alertService.presentAlert('Oooops', JSON.stringify(err));
        this.alertService.presentAlert('Gagal menyimpan data', 'Terdapat kesalahan saat menyimpan data');
    });
  }
}

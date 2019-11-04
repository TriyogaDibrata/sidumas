import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SharedService } from 'src/app/services/shared/shared.service';
import { LoadingController, NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';

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

  takePhoto(type) {
    const options: CameraOptions = {
      quality: 100, // picture quality
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      sourceType: this.camera.PictureSourceType.CAMERA,
    }
    this.camera.getPicture(options).then((imageData) => {

      if(type === "user_photo"){
        this.verified_foto = "data:image/jpeg;base64," + imageData;
      } else {
        this.ktp = "data:image/jpeg;base64," + imageData;
      }
    }, (err) => {
      this.alertService.presentAlert('Gagal membuka kamera', 'Terdapat kesalahan saat membuka kamera');
    });
  }

  getUserInformation(){
    let data = this.sharedService.getUserCache();
    this.user = data;
    this.user_id = data['id'];
    this.name = data['name'];
    this.email = data['email'];
    this.bio = data['description'];
    this.no_hp = data['no_hp'];
    this.birthday = data['tgl_lahir'];
    this.nik = data['nik'];
    this.ktp = data['ktp'];
    this.verified_foto = data['verified_foto'];
    this.path_ktp = data['path_ktp'];
    this.path_verified_foto = data['path_verified_foto'];
    this.sex = data['sex'];
    this.status = data['status'];    
  }

  updateProfile(){
    this.showLoading();

    let data = {
      'id'            : this.user_id,
      'name'          : this.name,
      'description'   : this.bio,
      'sex'           : this.sex,
      'no_hp'         : this.no_hp,
      'tgl_lahir'     : this.birthday,
      'nik'           : this.nik,
      'ktp'           : this.ktp,
      'foto'          : this.verified_foto
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
        this.alertService.presentAlert('Oooops', err);
        this.alertService.presentAlert('Gagal menyimpan data', 'Terdapat kesalahan saat menyimpan data');
    });
  }
}

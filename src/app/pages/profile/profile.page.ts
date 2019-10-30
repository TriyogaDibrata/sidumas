import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { AuthService } from 'src/app/services/auht/auth.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { NavController, AlertController, LoadingController, ActionSheetController, ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { AlertService } from 'src/app/services/alert/alert.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/services/env/env.service';
import { ModalImagePage } from 'src/app/modal-image/modal-image.page';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user : any = {};
  user_name : any;
  user_email : any;
  user_id : any;
  statuses : any = {};
  loading : any;
  public base64Image: string;
  user_avatar : any;
  token : any;

  constructor(
    public commonService  : CommonService,
    private authService   : AuthService,
    private sharedService : SharedService,
    public navCtrl        : NavController,
    public alertCtrl      : AlertController,
    public loadingCtrl    : LoadingController,
    public camera         : Camera,
    public crop           : Crop,
    private actionSheetCtrl : ActionSheetController,
    public alertService   : AlertService,
    private http          : HttpClient,
    private env           : EnvService,
    public modalCtrl      : ModalController,
  ) { }

  ngOnInit() {
    // this.getUser();
  }

  ionViewWillEnter(){
    this.getUser();
    this.showLoading();
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Perhatian!',
      message: 'Apakah anda yakin ingin keluar ?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ya',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  logout(){
    this.sharedService.user = null;
    this.authService.logout();
  }

  getUser(){
    this.user = this.sharedService.getUserCache();
    this.lihatUserStatus(this.user.id);
  }

  update_profile(id){
    this.navCtrl.navigateForward(['/update-profile', id]);
  }

  update_password(id){
    this.navCtrl.navigateForward(['/update-password', id]);
  }

  lihatUserStatus(user_id){
    this.sharedService.seeUserStatus(user_id)
    .subscribe(data => {
      this.statuses = data;
      this.loading.dismiss();
    }, err => {
      console.log(err);
      this.loading.dismiss();
    });
  }

  async showLoading(){
    this.loading = await this.loadingCtrl.create({
      spinner : "dots",
      backdropDismiss : true,
      message : "Loading..."
    });

    await this.loading.present();
  }

  async presentActionSheet(){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Profile',
      buttons: [{
        text: 'Lihat Foto Profile',
        icon: 'search',
        handler: () => {
          this.PresentImage(this.user_avatar);
        }
      }, {
        text: 'Ubah Foto Profile',
        icon: 'images',
        handler: () => {
          this.updateAvatarOptions();
        }
      }, {
        text: 'Batal',
        icon: 'close-circle',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async updateAvatarOptions() {
    const alert = await this.alertCtrl.create({
      // header: 'Confirm!',
      message: 'Ubah foto profile',
      buttons: [{
          text: 'Kamera',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text : 'Galeri',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }
      ]
    });
    await alert.present();
  }

  takePhoto(type){

    const options: CameraOptions = {
      quality: 100, // picture quality
      targetHeight: 600,
      targetWidth: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      sourceType: type,
    }

    this.camera.getPicture(options).then((imageData) => {
      
      if(imageData){
        this.base64Image = "data:image/jpeg;base64," + imageData;
            let data = {
              'id'      : this.user.id,
              'avatar'  : this.base64Image,
            };
            this.sharedService.updateAvatar(data)
            .subscribe(data => {
              if(data['success']){
                this.ionViewWillEnter();
                this.doRefresh(event);
                this.sharedService.getUserCache(true);
              } else {
                this.alertService.presentAlert('Gagal menyimpan data', 'Terdapat kesalahan saat menyimpan data');
              }
            }, err => {
              this.alertService.presentAlert('Gagal menyimpan data', 'Terdapat kesalahan saat menyimpan data');
            });
      }
    }, (err) => {
      console.log(err);
    });
  }

  doRefresh(event){
    this.token = this.authService.token;

      let headers = new HttpHeaders ({
        'Accept'        : 'application/json',
        'Content-Type'  : 'application/json',
        'Authorization' : 'Bearer ' + this.token,
      });

      this.user = this.http.get(this.env.API_URL + 'user', {headers : headers})
      .subscribe(data => {
        this.user = data;
        event.target.complete();
      }, err => {
        console.log(err);
        event.target.complete();
      });
  }

  async PresentImage(image: any){
    const modal = await this.modalCtrl.create({
      component: ModalImagePage,
      componentProps: {
        image: image
      }
    });
    return await modal.present();
  }

}

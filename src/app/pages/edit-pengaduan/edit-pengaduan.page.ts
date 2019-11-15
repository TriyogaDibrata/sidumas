import { Component, OnInit } from '@angular/core';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/services/shared/shared.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoadingController, AlertController, ModalController, ActionSheetController } from '@ionic/angular';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { ModalPlacesPage } from 'src/app/modal-places/modal-places.page';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

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
  address         : any;
  lat             : any;
  lng             : any;
  base64Image     : any;
  photos          : any = [];

  constructor(public route          : ActivatedRoute,
              public Router         : Router,
              public sharedService  : SharedService,
              public alertService   : AlertService,
              public loadingCtrl    : LoadingController,
              public alertCtrl      : AlertController,
              public nativeGeocoder : NativeGeocoder,
              public modalCtrl      : ModalController,
              public actionSheetCtrl: ActionSheetController,
              public camera         : Camera) {
                this.files = [];
                this.photos = [];
               }

  ngOnInit() {
    this.pengaduan_id = this.route.snapshot.paramMap.get('id');
    this.photos = [];
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
      this.geocoder(this.detail.koordinat_lat, this.detail.koordinat_lng);
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
    console.log();
  }

  deleteFiles(file_id, pengaduan_id, index){
    console.log(file_id, pengaduan_id);
    this.sharedService.deleteFile(file_id, pengaduan_id)
    .subscribe(data => {
      console.log(data);
      this.files.splice(index, 1);
    }, err => {
      console.log(err);
    })
  }

  async deleteFilesConfirm(file_id, pengaduan_id, index) {
    const confirm = await this.alertCtrl.create({
      header: 'Perhatian!',
      message: 'Apakah anda yakin untuk menghapus foto ini ?',
      buttons: [
        {
          text: 'Tidak',
          handler: () => {
            console.log('Disagree clicked');
          }
        }, {
          text: 'Iya',
          handler: () => {
            console.log('Agree clicked');
            this.deleteFiles(file_id, pengaduan_id, index);
          }
        }
      ]
    });
    await confirm.present();
  }

  geocoder(lat, lng){
    let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(lat, lng, options)
      .then((result: NativeGeocoderResult[]) =>
      {
        this.loading.dismiss();
        this.address = this.generateAddress(result[0]);
      }).catch((error: any) =>
      this.loading.dismiss());
  }

  generateAddress(addressObj){
      let obj = [];
      let address = "";
      for (let key in addressObj) {
        obj.push(addressObj[key]);
      }
      obj.reverse();
      for (let val in obj) {
        if(obj[val].length)
        address += obj[val]+', ';
      }
    return address.slice(0, -2);
  }

  async chooseLocation(){
    const modal = await this.modalCtrl.create({
      component : ModalPlacesPage,
    });

    modal.onDidDismiss().then(data => {
      this.lat = data['data']['lat'];
      this.lng = data['data']['lng'];
      this.geocoder(this.lat, this.lng);
    });

    return await modal.present();
  }

  async selectPhoto() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Upload Gambar',
      buttons: [{
        text: 'Pilih Dari Gallery',
        icon: 'photos',
        handler: () => {
          this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      }, {
        text: 'Ambil Gamber',
        icon: 'camera',
        handler: () => {
          this.takePhoto(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Batal',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  takePhoto(sourceType) {
    const options: CameraOptions = {
      quality: 100, // picture quality
      targetHeight: 600,
      targetWidth: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      sourceType: sourceType,
    }
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.photos.push(this.base64Image);
      this.photos.reverse();
    }, (err) => {
      console.log(err);
    });
  }

  async deletePhoto(index) {
    const confirm = await this.alertCtrl.create({
      header: 'Perhatiaan',
      message: 'Apakah anda yakin untuk menghapus foto ini ?',
      buttons: [
        {
          text: 'Tidak',
          handler: () => {
            console.log('Disagree clicked');
          }
        }, {
          text: 'Iya',
          handler: () => {
            console.log('Agree clicked');
            this.photos.splice(index, 1);
          }
        }
      ]
    });
    await confirm.present();
  }

}

import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { CameraPreview, CameraPreviewOptions } from '@ionic-native/camera-preview/ngx';
import { NavController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-lapor-file',
  templateUrl: './lapor-file.page.html',
  styleUrls: ['./lapor-file.page.scss'],
})
export class LaporFilePage implements OnInit {

  public screenHeight : any = window.screen.height / 2;

  public photos: any;
  public base64Image: string;
  dataObj : any = {};
  dataRec : any;

  constructor(public commonService : CommonService,
              public cameraPreview : CameraPreview,
              public navCtrl       : NavController,
              public alertCtrl     : AlertController,
              public camera        : Camera,
              private route        : ActivatedRoute,
              private router       : Router,
              private alertService : AlertService,
              ) 
  {
    this.photos = [];
    if(this.photos.length >= 5){
      this.toTinjau();
      this.alertService.presentToast('Maksimum 5 data');
    }
  }

  ionViewWillEnter(){
    this.openCamera();
  }

  ngOnInit() {
    this.dataRec = this.route.snapshot.paramMap.get('dataObj');
    this.photos = [];
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.cameraPreview.stopCamera();
  }

  ionViewWillLeave(){
    this.cameraPreview.stopCamera();
  }

  goTo(page){
    this.commonService.goTo(page);
  }

  goForward(page){
    this.commonService.goForward(page);
  }

  goBack(page){
    this.commonService.goForward(page);
  }

  back(){
    this.navCtrl.back();
  }

  openCamera(){
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      camera: this.cameraPreview.CAMERA_DIRECTION.BACK,
      tapPhoto: true,
      previewDrag: false,
      toBack: true,
      alpha: 1
    }

    this.cameraPreview.startCamera(cameraPreviewOpts);
  }

  // take a picture
  takePicture(){

    const pictureOpts: CameraPreviewOptions = {
      width: 1280,
      height: 1280
    }

    this.cameraPreview.takePicture(pictureOpts).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.photos.push(this.base64Image);
      this.photos.reverse();
    }, (err) => {
      console.log(err);
      // this.picture = 'assets/img/test.jpg';
    });
  }

  async deletePhoto(index) {
    const confirm = await this.alertCtrl.create({
      header: 'Perhatian!',
      message: 'Apakah anda yakin untuk menghapus foto ini ?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Agree clicked');
            this.photos.splice(index, 1);
          }
        }
      ]
    });
    await confirm.present();
  }

  openGallery() {
    const options: CameraOptions = {
      quality: 100, // picture quality
      targetHeight: 600,
      targetWidth: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    }
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.photos.push(this.base64Image);
      this.photos.reverse();
    }, (err) => {
      console.log(err);
    });
  }

  toTinjau(){
    let combineObj = { 
      'data' : this.dataRec,
      'files' : this.photos,
     };

    let dataString = JSON.stringify(combineObj);

    this.navCtrl.navigateForward(['lapor-tinjau', dataString]);
  }

}
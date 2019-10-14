import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common/common.service';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertService } from 'src/app/services/alert/alert.service';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lapor',
  templateUrl: './lapor.page.html',
  styleUrls: ['./lapor.page.scss'],
})
export class LaporPage implements OnInit {

  laporForm : FormGroup;
  
  lat       : any;
  lng       : any;
  address   : any;
  topik     : any;
  uraian    : any;
  kategori_id : any;
  hide_identity: boolean = false;
  hide_report: boolean = false;

  constructor( public formBuilder   : FormBuilder,
               public commonService : CommonService,
               public navCtrl       : NavController,
               private geolocation  : Geolocation,
               public alertService  : AlertService,
               public nativeGeocoder: NativeGeocoder,
               public route         : ActivatedRoute,
               public router        : Router,
               ) { 
               }

  ngOnInit() {
    this.laporForm = this.formBuilder.group({
      'topik' : [null, Validators.compose([
        Validators.required
      ])],
      'uraian' : [null, Validators.compose([
        Validators.required
      ])]
    });

    this.kategori_id = this.route.snapshot.paramMap.get('kategori_id');
    console.log(this.kategori_id);
  }

  ionViewWillEnter(){
    this.getLocation();
  }
  

  getLocation(){
    this.geolocation.getCurrentPosition()
    .then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      console.log(this.lat, this.lng);  
      this.geocoder(this.lat, this.lng);
    }, err=> {
      this.alertService.presentAlert('Tidak dapat menemukan lokasi', 'Terjadi kesalahan saat mendapatkan lokasi');
    });
  }

  geocoder(lat, lng){
    let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(lat, lng, options)
      .then((result: NativeGeocoderResult[]) => 
      {
        this.address = this.generateAddress(result[0]);
      }).catch((error: any) => console.log(error));
  }

  //Return Comma saperated address
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

  check(){
    if(!this.topik || !this.uraian){
      this.alertService.presentAlert('Lengkapi laporan anda', 'Silahkan lengkapi laporan anda untuk dapat melanjutkan');
    } else {
      this.toFile();
    }
  }

  toFile(){

    let dataObj = {
      'kategori_id' : this.kategori_id,
      'topik' : this.topik,
      'uraian' : this.uraian,
      'alamat' : this.address,
      'lat' : this.lat,
      'lng' : this.lng,
      'hide_identity' : this.hide_identity,
      'hide_report'   : this.hide_report,
    }

    let dataString = JSON.stringify(dataObj);

    this.navCtrl.navigateForward(['lapor-file', dataString]);
  }

  goTo(page){
    this.commonService.goTo(page);
  }

  goForward(page){
    this.commonService.goForward(page);
  }

  back(){
    this.navCtrl.back();
  }

  hide_id() {
    if (this.hide_identity == true) {
      this.alertService.presentAlert('Rahasiakan Identitas', 'Dengan mengaktifkan fitur ini maka identitas anda akan di rahasiakan');
    }
  }

  hide_rp() {
    if (this.hide_report == true) {
      this.alertService.presentAlert('Rahasiakan Pengaduan', 'Dengan mengaktifkan fitur ini maka pengaduan anda akan di rahasiakan');
    }
  }

}

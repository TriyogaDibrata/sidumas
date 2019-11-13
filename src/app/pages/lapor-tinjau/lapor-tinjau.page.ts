import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { NavController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared/shared.service';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-lapor-tinjau',
  templateUrl: './lapor-tinjau.page.html',
  styleUrls: ['./lapor-tinjau.page.scss'],
})
export class LaporTinjauPage implements OnInit {

  dataRec    : any;
  dataObj    : any = {};
  dataUraian : any = {};
  dataFiles  : any = {};
  photos     : any;
  user       : any = {};
  loading    : any;
  lat        : number;
  lng        : number;
  nama_kategori : any;
  desa       : any = {};

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  requireds  : any = [
    'user_id',
    'atas_nama',
    'topik',
    'uraian',
    'lat',
    'lng',
    'email',
    'kategori_id',
    'opd_id'
  ];

  hide_info : boolean = false;

  constructor(public commonService  : CommonService,
              public navCtrl        : NavController,
              private route         : ActivatedRoute,
              private router        : Router,
              private sharedService : SharedService,
              public alertService   : AlertService,
              public loadingCtrl    : LoadingController,
              ) { }

  ngOnInit() {
    this.showLoading();

    this.dataRec = this.route.snapshot.paramMap.get('dataObj');
    this.dataObj = JSON.parse(this.dataRec);
    this.dataUraian = JSON.parse(this.dataObj['data']);
    this.dataFiles = this.dataObj['files'];
    this.lat = this.dataUraian['lat'];
    this.lng = this.dataUraian['lng'];
    this.getCategoryName(this.dataUraian['kategori_id']);
    this.getDesa(this.lat, this.lng);
  }

  closeTag(){
    this.hide_info = true;
  }

  ionViewWillEnter(){
    this.getUser();
  }

  async showLoading(){
    this.loading = await this.loadingCtrl.create(this.sharedService.loadingOption);

    await this.loading.present();
  }

  goTo(page){
    this.commonService.goTo(page);
  }

  goBack(page){
    this.commonService.goBack(page);
  }

  goForward(page){
    this.commonService.goForward(page);
  }

  back(){
    this.navCtrl.back();
  }

  getUser(){
    this.user = this.sharedService.getUserCache();
  }

  getCategoryName(id){
    this.sharedService.getKategoriName(id)
    .subscribe(data => {
      this.nama_kategori = data['kategori_name'];
    }, err => {
      console.log(err);
    });
  }

  getDesa(lat, lng){
    this.sharedService.getDesaID(lat, lng).subscribe(data => {
      console.log(data);
      this.desa = data;
      this.loading.dismiss();
    }, err => {
      console.log(err);
    })
  }

  sendData(){
    let data = {
      'user_id': this.user['id'],
      'atas_nama': this.user['name'],
      'topik': this.dataUraian['topik'],
      'uraian': this.dataUraian['uraian'],
      'lat': this.dataUraian['lat'],
      'lng': this.dataUraian['lng'],
      'alamat': this.dataUraian['alamat'],
      'hide_identitas': this.dataUraian['hide_identity'],
      'hide_pengaduan': this.dataUraian['hide_report'],
      'email': this.user['email'],
      'kategori_id': this.dataUraian['kategori_id'],
      'files' : this.dataFiles,
      'opd_id' : this.desa.opd_id,
    };

    let valid=1;
    this.requireds.forEach((required) => {
      if(typeof data[required] === 'undefined' || data[required] == '' || data[required] == null){
        valid=0;
      }
    });

    if(valid===0){
      this.alertService.presentAlert('Gagal Menyimpan Pengaduan', 'Terjadi kesalahan saat membuat pengaduan, mohon ulangi menyimpan / ulangi proses pengaduan.');
      return false;
    }

    this.showLoading();

    this.sharedService.addPengaduan(data)
    .subscribe(data => {
      if(data['success']){
        this.loading.dismiss();
        this.navCtrl.navigateRoot('app/tabs/home');
        this.alertService.presentToast('Pengaduan Berhasil Disimpan')
      } else{
        this.loading.dismiss();
        this.alertService.presentAlert('Gagal menyimpan data', 'Terjadi kesalahan saat menyimpan data');
      }
    }, err => {
      this.loading.dismiss();
      this.alertService.presentAlert('Gagal menyimpan data', 'Terjadi kesalahan saat menyimpan data');
    });
  }


}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared/shared.service';
import * as moment from 'moment';
import { AlertService } from 'src/app/services/alert/alert.service';
import { IonContent, NavController } from '@ionic/angular';

@Component({
  selector: 'app-detail-laporan',
  templateUrl: './detail-laporan.page.html',
  styleUrls: ['./detail-laporan.page.scss'],
})
export class DetailLaporanPage implements OnInit {

  @ViewChild(IonContent, {static : false}) content: IonContent;

  pengaduan_id : any;
  data : any;
  nama_pelapor : any;
  tracking_id : any;
  tanggal : any;
  topik : any;
  uraian : any;
  color : any;
  status : any;
  kategori : any;
  tanggapans : any;
  komentars : any;
  dukungans : any;
  avatar : any;
  count_tanggapans : any;
  count_komentars : any;
  count_dukungans : any;
  files : any;
  komentar_user : any;
  statusShow : any;
  hide_info : boolean = false;

  showTanggapans : boolean = false;
  tanggapan_color: any = "none";

  showKomentars : boolean = false;
  komentar_color : any = "none";
  user : any = {};
  color_vote : any = "none";

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor(private route         : ActivatedRoute,
              private router        : Router,
              private sharedService : SharedService,
              public alertService   : AlertService,
              public navCtrl        : NavController,
              ) { }

  ngOnInit() {
    this.pengaduan_id = this.route.snapshot.paramMap.get('id');
    this.getUser();
    this.getDetail();
    this.getComments();
    this.getTanggapans();
    this.getUser();
  }

  ionViewWillEnter(){
    
  }

  getDetail(){
    this.sharedService.getDetailPengaduan(this.pengaduan_id)
    .subscribe(data => {
      console.log(data);
      if(data){
        this.data = data['data'];
        this.count_tanggapans = this.data['tanggapans']['length'];
        this.count_komentars = this.data['comments']['length'];
        this.count_dukungans = this.data['likes']['length'];
        this.files = this.data['files'];
        this.statusShow = this.data['statusshow'];
      }
    }, err => {
      console.log(err);
    });
  }

  getComments(){
    this.sharedService.getComments(this.pengaduan_id)
    .subscribe(data => {
      this.komentars = data['data'];
    })
  }

  getTanggapans(){
    this.sharedService.getTanggapans(this.pengaduan_id)
    .subscribe(data => {    
      this.tanggapans = data['data'];
    })
  }

  converTime(time) {
    moment.locale('id')
    // let local_time = moment(time).format('dddd, DD-MM-YYYY');
    let local_time = moment(time).fromNow();
    return local_time;
  }

  displayTanggapans() {
    this.showKomentars = false;
    this.komentar_color = "none";
    this.showTanggapans = !this.showTanggapans;
    if(this.showTanggapans == true){
      this.tanggapan_color = "danger";
    } else {
      this.tanggapan_color = "none";
    }
  }

  displayKomentars() {
    this.showTanggapans = false;
    this.tanggapan_color = "none";
    this.showKomentars = !this.showKomentars;
    if(this.showKomentars == true){
      this.komentar_color = "danger";
    } else {
      this.komentar_color = "none";
    }
  }

  getUser(){
    this.sharedService.getUser()
    .subscribe(data => {
      this.user = data;
    });
  }

  addKomentar(){
    let data = {
      'user_id' : this.user['id'],
      'pengaduan_id'  : this.pengaduan_id,
      'komentar'  : this.komentar_user
    }

    this.sharedService.postKomentar(data)
    .subscribe(data => {
      if(data['success']){
        this.alertService.presentToast(data['message']);
        this.komentar_user = '';
        this.ionViewWillEnter();
        this.content.scrollToBottom(0);
      } else {
        this.alertService.presentAlert('Perhatian', data['message']);
      }
    }, err => {
      console.log(err);
    })
  }

  addVote(){
    let data = {
      'user_id'     : this.user['id'],
      'pengaduan_id': this.pengaduan_id,
    }

    this.sharedService.addVote(data)
    .subscribe(data => {
      if(data['success']){
        this.ngOnInit();
      } else {
        this.alertService.presentAlert('Gagal Menyimpan Data', 'Terjadi kesalahan saat menyimpan data');
      }
    }, err => {
        this.alertService.presentAlert('Gagal Menyimpan Data', 'Terjadi kesalahan saat menyimpan data');
    });
  }

  closeTag(){
    this.hide_info = true;
  }

  // checkVoted(user_id){
  //   this.sharedService.checkVoted(user_id, this.pengaduan_id)
  //   .subscribe(data => {  
  //     if(data['status']){
  //       this.color_vote = "danger";
  //     } else {
  //       this.color_vote = "none";
  //     }
  //   })
  // }

  checkLocation(lat, lng){
    this.navCtrl.navigateForward(['lokasi', lat, lng]);
  }
}

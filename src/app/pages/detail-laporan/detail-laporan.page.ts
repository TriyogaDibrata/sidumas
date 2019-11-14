import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared/shared.service';
import * as moment from 'moment';
import { AlertService } from 'src/app/services/alert/alert.service';
import { IonContent, NavController, LoadingController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { CommonService } from 'src/app/services/common/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-detail-laporan',
  templateUrl: './detail-laporan.page.html',
  styleUrls: ['./detail-laporan.page.scss'],
})
export class DetailLaporanPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;

  loading: any;
  pengaduan_id: any;
  data: any;
  nama_pelapor: any;
  tracking_id: any;
  tanggal: any;
  topik: any;
  uraian: any;
  color: any;
  status: any;
  kategori: any;
  tanggapans: any = [];
  komentars: any = [];
  dukungans: any;
  avatar: any;
  count_tanggapans: any;
  count_komentars: any;
  count_dukungans: any;
  files: any;
  komentar_user: any;
  tanggapan_user: any;
  statusShow: any;
  hide_info: boolean = false;

  showTanggapans: boolean = false;
  tanggapan_color: any = "none";

  showKomentars: boolean = false;
  komentar_color: any = "none";
  user: any = {};
  color_vote: any = "none";
  disabled_submit: boolean = false;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  commentForm: FormGroup;
  tanggapanForm: FormGroup;

  constructor(private route: ActivatedRoute,
    private router: Router,
    public sharedService: SharedService,
    public alertService: AlertService,
    public navCtrl: NavController,
    public socialSharing: SocialSharing,
    public loadingCtrl: LoadingController,
    public commonService: CommonService,
    public formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.pengaduan_id = this.route.snapshot.paramMap.get('id');
    this.commentForm = this.formBuilder.group({
      'komentar_user': [null, Validators.compose([
        Validators.required
      ])]
    });

    this.tanggapanForm = this.formBuilder.group({
      'tanggapan_user': [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  ionViewWillEnter() {
    this.showLoading();
    this.getUser();
    this.getDetail();
  }

  getDetail() {
    this.sharedService.getDetailPengaduan(this.pengaduan_id)
      .subscribe(data => {
        console.log(data);
        if (data) {
          this.data = data['data'];
          this.count_tanggapans = this.data['tanggapans']['length'];
          this.count_komentars = this.data['comments']['length'];
          this.count_dukungans = this.data['likes']['length'];
          this.files = this.data['files'];
          this.statusShow = this.data['statusshow'];
          this.loading.dismiss();
        }
      }, err => {
        this.loading.dismiss();
        this.commonService.presentAlert("Gagal memuat", "Terjadi kesalah saat memuat konten");
      });
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(500)
    }, 100);
  }

  getComments() {
    this.showLoading();
    this.sharedService.getComments(this.pengaduan_id)
      .subscribe(data => {
        console.log(data);
        this.komentars = data['data'];
        this.scrollToBottom();
        this.sharedService.pengaduan.comments_count = this.komentars.length;
        this.loading.dismiss();
      }, err => {
        this.alertService.presentAlert('Terjadi kesalahan', 'Terjadi kesalahan saat memuat data');
      })
  }

  getTanggapans() {
    this.showLoading();
    this.sharedService.getTanggapans(this.pengaduan_id)
      .subscribe(data => {
        console.log(data);
        this.tanggapans = data['data'];
        this.scrollToBottom();
        this.sharedService.pengaduan.tanggapans_count = this.tanggapans.length;
        this.loading.dismiss();
      }, err => {
        this.alertService.presentAlert('Terjadi kesalahan', 'Terjadi kesalahan saat memuat data');
      })
  }

  converTime(time) {
    moment.locale('id')
    let local_time = moment(time).fromNow();
    return local_time;
  }

  displayTanggapans() {
    this.showKomentars = false;
    this.komentar_color = "none";
    this.showTanggapans = !this.showTanggapans;
    if (this.showTanggapans == true) {
      this.tanggapan_color = "danger";
      this.getTanggapans();
    } else {
      this.tanggapan_color = "none";
    }
  }

  displayKomentars() {
    this.showTanggapans = false;
    this.tanggapan_color = "none";
    this.showKomentars = !this.showKomentars;
    if (this.showKomentars == true) {
      this.komentar_color = "danger";
      this.getComments();
    } else {
      this.komentar_color = "none";
    }
  }

  getUser() {
    this.user = this.sharedService.getUserCache();
  }

  addKomentar(form: FormGroup) {
    if (!this.disabled_submit) {
      this.disabled_submit = true;
      let data = {
        'user_id': this.user['id'],
        'pengaduan_id': this.pengaduan_id,
        'komentar': form.value.komentar_user
      }

      this.sharedService.postKomentar(data)
        .subscribe(data => {
          this.disabled_submit = false;
          if (data['success']) {
            this.alertService.presentToast(data['message']);
            form.reset();
            this.getDetail();
            this.getComments();
          } else {
            this.alertService.presentAlert('Perhatian', data['message']);
          }
        }, err => {
          console.log(err);
        })
    }
  }

  doRefresh(event){    
    this.sharedService.getDetailPengaduan(this.pengaduan_id)
    .subscribe(data => {
      this.data = data['data'];
      event.target.complete();
      this.loading.dismiss();
    }, err => {
      this.loading.dismiss();
      this.alertService.presentAlert('Terjadi Kesalahan', 'Tidak dapat memuat data');
    })
  }

  addTanggapan(form: FormGroup) {
    if (!this.disabled_submit) {
      this.disabled_submit = true;
      let data = {
        'user_id': this.user['id'],
        'pengaduan_id': this.pengaduan_id,
        'tanggapan': form.value.tanggapan_user
      }

      this.sharedService.postTanggapan(data)
        .subscribe(data => {
          if (data['success']) {
            this.disabled_submit = false;
            this.alertService.presentToast(data['message']);
            form.reset();
            this.getDetail();
            this.getTanggapans();
          } else {
            this.alertService.presentAlert('Perhatian', data['message']);
          }
        }, err => {
          console.log(err);
        })
    }
  }

  addVote(pengaduan) {
    let data = {
      'user_id': this.sharedService.getUserCache().id,
      'pengaduan_id': pengaduan.id,
    }

    this.sharedService.addVote(data)
      .subscribe(data => {
        if (data['success'] && data['new_user']) {
          pengaduan['likes']['length']++;
          pengaduan['is_like'] = true;
          this.sharedService.pengaduan.is_like = 1;
          this.sharedService.pengaduan.likes_count = pengaduan['likes']['length'];
        } else if (data['success'] && !data['new_user']) {
          pengaduan['likes']['length']--;
          pengaduan['is_like'] = null;
          this.sharedService.pengaduan.is_like = null;
          this.sharedService.pengaduan.likes_count = pengaduan['likes']['length'];
        } else {
          this.alertService.presentAlert('Gagal Menyimpan Data', 'Terjadi kesalahan saat menyimpan data');
        }
      }, err => {
        this.alertService.presentAlert('Gagal Menyimpan Data', 'Terjadi kesalahan saat menyimpan data');
      });
  }

  closeTag() {
    this.hide_info = true;
  }

  checkLocation(lat, lng) {
    this.navCtrl.navigateForward(['lokasi', lat, lng]);
  }

  voteColor(islike) {
    if (islike == null) {
      return "none"
    } else {
      return "danger";
    }
  }

  share(data) {
    this.socialSharing.share(data.topik, null, null, "https://sidumas.badungkab.go.id/T/" + data.no_tiket).then(() => {
      console.log("shareSheetShare: Success");
    }).catch(() => {
      console.error("shareSheetShare: failed");
    });
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create(this.sharedService.loadingOption);

    await this.loading.present();
  }

  editPengaduan(id){
    this.navCtrl.navigateForward(['edit-pengaduan', id]);
  }
}

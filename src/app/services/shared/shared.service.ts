import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../env/env.service';
import { AuthService } from '../auht/auth.service';
import { Storage } from '@ionic/storage';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  token: any;
  headers: any;
  notif: any = { news: 0 };
  user: any = null;
  banners: any = { get: 0, data: [], popover: {} };
  pengaduan: any;
  loadingOption: any = {
    spinner : null,
    backdropDismiss : false,
    message : '<div class="sidumas-loading lds-ring"><div></div><div></div><div></div><div></div><img src="assets/images/icon-min-200.png"></div>',
    cssClass: 'sidumas-loading',
    keyboardClose: true,
    animated: true,
  };

  constructor(
    private http        : HttpClient,
    private env         : EnvService,
    private storage     : Storage,
    private authService : AuthService,
    public alertService : AlertService
  ) {
  }

  ngOnInit(): void {
  }

  getListPengaduan(category = '', search = '', page = '') {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.get(this.env.API_URL + 'pengaduan/list?cid=' + category + '&s=' + search + '&page=' + page, { headers: this.headers })
      .pipe(
      );
  }

  getDetailPengaduan(id) {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.get(this.env.API_URL + 'pengaduan/detail?pengaduan_id=' + id, { headers: this.headers })
      .pipe(
      );
  }

  getComments(id) {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.get(this.env.API_URL + 'pengaduan/komentar?pengaduan_id=' + id, { headers: this.headers })
      .pipe(
      );
  }

  getTanggapans(id) {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.get(this.env.API_URL + 'pengaduan/tindaklanjut?pengaduan_id=' + id, { headers: this.headers })
      .pipe();
  }

  getKategori() {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.get(this.env.API_URL + 'pengaduan/menu', { headers: this.headers })
      .pipe(

      );
  }

  getKategoriName(id) {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.get(this.env.API_URL + 'pengaduan/category?id=' + id, { headers: this.headers })
      .pipe();
  }

  getAllCategory(){
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.get(this.env.API_URL + 'pengaduan/all-category', { headers: this.headers })
      .pipe();
  }

  getUser() {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.get(this.env.API_URL + 'user', { headers: this.headers })
      .pipe();
  }

  getUserCache(force = false) {
    if (this.user == null || force) {
      this.token = this.authService.token;

      this.headers = new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
      });

      this.user = this.http.get(this.env.API_URL + 'user', { headers: this.headers })
        .subscribe(data => {
          this.user = data;
          return this.user;
        }, err => {
          console.log(err);
        });
    }
    return this.user;
  }

  checkUser(user_id) {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    let data = {
      id: user_id
    }
    return this.http.post(this.env.API_URL + 'pengaduan/check-user', data, { headers: this.headers })
      .pipe(

      )
  }

  updateProfileUser(updated_information) {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    let data = updated_information;

    return this.http.post(this.env.API_URL + 'pengaduan/update-user', data, { headers: this.headers })
      .pipe();
  }

  addPengaduan(data) {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.post(this.env.API_URL + 'pengaduan/add', data, { headers: this.headers })
      .pipe();
  }

  getProject(opd_id) {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.get(this.env.API_URL + 'pengaduan/projectppl?opd_id=' + opd_id, { headers: this.headers })
      .pipe();
  }

  detailProject(project_id) {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.get(this.env.API_URL + 'pengaduan/detailproject?project_id=' + project_id, { headers: this.headers })
      .pipe();
  }

  postKomentar(data) {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.post(this.env.API_URL + 'pengaduan/add-komentar', data, { headers: this.headers })
      .pipe();
  }

  postTanggapan(data) {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.post(this.env.API_URL + 'pengaduan/tanggapan', data, { headers: this.headers })
      .pipe();
  }

  seeUserStatus(user_id) {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.get(this.env.API_URL + 'pengaduan/lihat-user?id=' + user_id, { headers: this.headers })
      .pipe();
  }

  updatePassword(data) {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.post(this.env.API_URL + 'pengaduan/update-password', data, { headers: this.headers })
      .pipe();
  }

  addVote(data) {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.post(this.env.API_URL + 'pengaduan/add-vote', data, { headers: this.headers })
      .pipe();
  }

  checkVoted(user_id, pengaduan_id) {
    return this.http.get(this.env.API_URL + 'pengaduan/checkvote?user_id=' + user_id + '&pengaduan_id=' + pengaduan_id, { headers: this.headers })
      .pipe();

  }

  myList(user_id, category = '', page = '') {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.get(this.env.API_URL + 'pengaduan/listsaya?user_id=' + user_id + '&cid=' + category + '&page=' + page, { headers: this.headers })
      .pipe();
  }

  /*
    notifications
  */
  getNotifs(user_id, page = 0, first = 0) {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.get(this.env.API_URL + 'pengaduan/notifikasi?limit=20&page=' + page + '&id=' + user_id + '&first=' + first, { headers: this.headers })
      .pipe();
  }

  getNewNotif() {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    this.http.get(this.env.API_URL + 'pengaduan/notifikasi/new', { headers: this.headers })
      .subscribe((data) => {
        this.notif = data;
      }, err => {
        console.log('err');
        // this.alertService.presentAlert('Gagal menyimpan data', 'Terdapat kesalahan saat menyimpan data');
      });
  }

  getMenuCategories() {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.get(this.env.API_URL + 'pengaduan/menu-category', { headers: this.headers })
      .pipe();
  }

  updateAvatar(data) {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });
    return this.http.post(this.env.API_URL + 'pengaduan/update-avatar', data, { headers: this.headers })
      .pipe();
  }

  getBanners(VersionNumber = "", VersionCode= "") {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.get(this.env.API_URL + 'ref/banners?vc='+VersionCode+'&v='+VersionNumber, { headers: this.headers })
      .pipe();
  }

  forgotPassword(data) {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    return this.http.post(this.env.API_URL + 'lupapassword', data, { headers: this.headers })
      .pipe();
  }

  getDesaID(lat: any, lng: any) {
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    let data = {
      'lat'   : lat,
      'lng'   : lng
    }
    return this.http.get(this.env.API_URL + 'pengaduan/desa?lat='+lat+'&lng='+lng, { headers: this.headers })
      .pipe();
  }

  deleteFile(file_id, pengaduan_id){
    this.token = this.authService.token;

    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    let data = {
      'id'  : file_id,
      'pengaduan' : pengaduan_id
    }

    return this.http.post(this.env.API_URL + 'pengaduan/remove-file', data, {headers : this.headers})
    .pipe();
  }
}

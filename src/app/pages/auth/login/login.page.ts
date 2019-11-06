import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auht/auth.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { Facebook } from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public password_type : String = "password";
  public hide_password : boolean = true;
  public loginForm : FormGroup;


  constructor(
    public commonService : CommonService,
    private formBuilder  : FormBuilder,
    public loadingCtrl   : LoadingController,
    private authService  : AuthService,
    private sharedService: SharedService,
    public alertCtrl     : AlertController,
    private fb           : Facebook,
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      'email' : [null, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      'password' : [null, Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])]
    });
  }

  ionViewWillEnter(){
  }

  showPassword(){
    this.password_type = "text";
    this.hide_password = false;
  }

  hidePassword(){
    this.password_type = "password";
    this.hide_password = true;
  }

  goTo(page : String){
    this.commonService.goTo(page);
  }

  async showLoading(loading) {
    return await loading.present();
  }

  async login(form : FormGroup){
    const loading = await this.loadingCtrl.create({
      message: "Mohon Menunggu ..."
    });

    this.showLoading(loading);

    this.authService.login(form.value.email, form.value.password)
    .subscribe(data => {

      if(data) {
        this.sharedService.getUserCache(true);
        this.commonService.presentToast('Login Berhasil');
        this.commonService.goTo('app/tabs/home');
        loading.dismiss();
      }
    }, err => {      
      this.commonService.presentAlert('Login Gagal', err.error.errors.email[0]);
      loading.dismiss();
    });
  }

  async forgotPass() {
    const alert = await this.alertCtrl.create({
      header: 'Lupa Password?',
      message: 'Masukan email untuk mendapatkan link reset password',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Konfirmasi',
          handler: async data => {
            let form = {
              'email': data.email,
            };

            this.sharedService.forgotPassword(form)
            .subscribe(data => {
              if(data['success']){
                this.commonService.presentAlert('Perhatian !', data['message']);
              } else {
                this.commonService.presentAlert('Perhatian !', data['message']);
              }
            }, err => {
              this.commonService.presentAlert('Proses Gagal', 'Terjadi kesalahan saat menyimpan data');
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async fbLogin(){
    const permissions = ["public_profile", "email"];

    const loading = await this.loadingCtrl.create({
      message: "Mohon Menunggu ..."
    });

    this.fb.login(permissions)
    .then(response => {
      let UserId = response.authResponse.userID;
      
      this.fb.api("/me?fields=name,email", permissions)
      .then(user => {
        user.picture = "https://graph.facebook.com/" + UserId + "/picture?type=large";
        let sm_type = 'facebook';

        if (user){
          this.authService.socialMediaLogin(user.name, user.email, sm_type, user.id, user.picture)
          .subscribe(data => {
            if (data){
              this.sharedService.getUserCache(true);
              this.commonService.presentToast('Login Berhasil');
              this.commonService.goTo('app/tabs/home');
              loading.dismiss();
            }
          }, err => {
            this.commonService.presentAlert('Login Gagal', 'Terjadi kesalahan saat proses login');
          });
        }
      })

    }, err => {
      this.commonService.presentAlert('Login Gagal', 'Terjadi kesalahan saat proses login');
    });
  }

}

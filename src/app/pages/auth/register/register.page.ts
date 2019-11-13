import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auht/auth.service';
import { Storage } from '@ionic/storage';
import { SharedService } from 'src/app/services/shared/shared.service';
import { Facebook } from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  password_type : String = "password";
  c_password_type : String = "password";
  hide_password : boolean = true;
  hide_c_password : boolean = true;

  public registerForm : FormGroup;

  constructor(
    public commonService : CommonService,
    private formBuilder  : FormBuilder,
    public loadingCtrl   : LoadingController,
    private authService  : AuthService,
    private storage      : Storage,
    private sharedService: SharedService,
    private fb           : Facebook,
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      'name'  : [null, Validators.compose([
        Validators.required
      ])],
      'no_telp' : [null, Validators.compose([
        Validators.required
      ])],
      'email' : [null, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      'password' : [null, Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])],
      'c_password': [null, Validators.compose([
        Validators.required,
        Validators.minLength(8),
      ])]
    }, {
      validator: this.matchPassword
    });
  }

  private matchPassword(AC: AbstractControl){
    const password    = AC.get('password').value;
    const c_password  = AC.get('c_password').value;

    if(password != c_password){
      AC.get('c_password').setErrors({ matchPassword: true })
    } else {
      AC.get('c_password').setErrors(null);
    }
  }

  goTo(page: String){
    this.commonService.goTo(page);
  }

  showPassword(){
    this.password_type = "text";
    this.hide_password = false;
  }

  hidePassword(){
    this.password_type = "password";
    this.hide_password = true;
  }

  showCPassword(){
    this.c_password_type = "text";
    this.hide_c_password = false;
  }

  hideCPassword(){
    this.c_password_type = "password";
    this.hide_c_password = true;
  }

  async presentLoading(loading){
    return await loading.present();
  }

  async register(form: FormGroup){
    const loading = await this.loadingCtrl.create(this.sharedService.loadingOption);

    this.presentLoading(loading);

    this.authService.register(form.value.name, form.value.no_telp, form.value.email, form.value.password, form.value.c_password)
    .subscribe(data => {
      console.log(data);
      if(data){
        this.storage.set('token', data['token'])
        .then(
          ()=> {
            loading.dismiss();
            this.commonService.goTo('app/tabs/home');
            this.commonService.presentToast('Proses registrasi berhasil, silahkan login untuk dapat masuk ke dalam sistem');
          }, err => {
            this.commonService.presentAlert('Gagal Menyimpan Data', 'Terjadi kesalahan saat menyimpan data');
          }
        );
      }
    }, err => {
      let errors = err.error.errors;
      this.commonService.presentAlert('Daftar Gagal', errors[Object.keys(errors)[0]]);
      loading.dismiss();
    })
  }

  async fbLogin(){
    const permissions = ["public_profile", "email"];

    const loading = await this.loadingCtrl.create(this.sharedService.loadingOption);

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

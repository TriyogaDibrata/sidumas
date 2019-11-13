import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SharedService } from 'src/app/services/shared/shared.service';
import { LoadingController, NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.page.html',
  styleUrls: ['./update-password.page.scss'],
})
export class UpdatePasswordPage implements OnInit {

  updateForm      : FormGroup;
  user            : any = {};
  loading         : any;


  constructor(private formBuilder     : FormBuilder,
              private sharedService   : SharedService,
              public loadingCtrl      : LoadingController,
              public alertService     : AlertService,
              public navCtrl          : NavController,
             ) { }

  ionViewWillEnter(){
    this.getUser();
  }

  ngOnInit() {
    this.updateForm = this.formBuilder.group({
      'old_password' : [null, Validators.compose([
        Validators.required,
      ])],
      'new_password' : [null, Validators.compose([
        Validators.required
      ])],
      'c_new_password': [null, Validators.compose([
        Validators.required
      ])]
    }, {
      validator: this.matchPassword
    });
  }

  async showLoading(){
    this.loading = await this.loadingCtrl.create(this.sharedService.loadingOption);

    await this.loading.present();
  }

  private matchPassword(AC: AbstractControl){
    const password    = AC.get('new_password').value;
    const c_password  = AC.get('c_new_password').value;

    if(password != c_password){
      AC.get('c_new_password').setErrors({ matchPassword: true })
    } else {
      AC.get('c_new_password').setErrors(null);
    }
  }

  getUser(){
    this.user = this.sharedService.getUserCache();
  }

  update(form: FormGroup){
    this.showLoading();
    let data = {
      'id'  : this.user['id'],
      'old' : form.value.old_password,
      'new' : form.value.new_password
    }

    this.sharedService.updatePassword(data)
    .subscribe(data => {
      console.log(data);
      if(data['success']){
        this.loading.dismiss();
        this.navCtrl.navigateRoot('app/tabs/profile');
        this.alertService.presentToast(data['message']);
      } else {
        this.loading.dismiss();
        this.alertService.presentAlert('Gagal memperbaharui password', data['message']);
      }
    }, err => {
      this.loading.dismiss();
      this.alertService.presentAlert('Terjadi kesalahan', err);
    });
  }

}

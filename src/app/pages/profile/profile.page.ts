import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { AuthService } from 'src/app/services/auht/auth.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user : any;
  user_name : any;
  user_email : any;
  user_id : any;
  statuses : any = {};

  constructor(
    public commonService  : CommonService,
    private authService   : AuthService,
    private sharedService : SharedService,
    public navCtrl        : NavController,
    public alertCtrl      : AlertController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getUser();
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Perhatian!',
      message: 'Apakah anda yakin ingin keluar ?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ya',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  logout(){
    this.authService.logout();
  }

  getUser(){
    this.sharedService.getUser()
    .subscribe(data => {
      this.user = data;
      this.user_name = data['name'];
      this.user_email = data['email'];
      this.user_id = data['id'];
      console.log(data);
      this.lihatUserStatus(this.user_id);
    })
  }

  update_profile(id){
    this.navCtrl.navigateForward(['/update-profile', id]);
  }

  update_password(id){
    this.navCtrl.navigateForward(['/update-password', id]);
  }

  lihatUserStatus(user_id){
    this.sharedService.seeUserStatus(user_id)
    .subscribe(data => {
      console.log(data);
      this.statuses = data;
    });s
  }

}

import { Injectable } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    public navCtrl    : NavController,
    public toast      : ToastController,
    public alert      : AlertController,
  ) { }

  goTo(page){
    this.navCtrl.navigateRoot(page);
  }

  goForward(page){
    this.navCtrl.navigateForward(page);
  }

  goBack(page){
    this.navCtrl.navigateBack(page);
  }

  async presentToast(message: any){
    const toast = await this.toast.create({
      message   : message,
      duration  : 2000,
      position  : 'top',
      color     : 'dark'
    });

    toast.present();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    alert.present();
  }
}

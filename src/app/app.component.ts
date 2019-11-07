import { Component, ViewChildren, QueryList } from '@angular/core';

import { Platform, ModalController, MenuController, ActionSheetController, PopoverController, ToastController, IonRouterOutlet, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SharedService } from 'src/app/services/shared/shared.service';
import { AuthService } from 'src/app/services/auht/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AlertService } from './services/alert/alert.service';
import { Router } from '@angular/router';
import { Toast } from '@ionic-native/toast/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  lastTimeBackPress = 0;
    timePeriodToExit = 2000;

    @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private sharedService: SharedService,
    private authService: AuthService,
    private commonService: CommonService,
    private alertService : AlertService,
    public modalCtrl: ModalController,
    private menu: MenuController,
    private actionSheetCtrl: ActionSheetController,
    private popoverCtrl: PopoverController,
    private router: Router,
    private toast: Toast,
    public alertCtrl : AlertController,
  ) {
    this.initializeApp();

    this.backButtonEvent();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.authService.getToken().then(data => {
        if(this.authService.isLoggedIn){
          this.commonService.goTo('app/tabs/home');
          this.sharedService.getNewNotif();          
          this.sharedService.getUserCache(true);
        }else{
          this.commonService.goTo('login');
        }
      })
    });

    this.platform.resume.subscribe(() => {
      this.sharedService.getNewNotif();
    });
  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.routerOutlets.forEach(async(outlet: IonRouterOutlet) => {
        console.log(this.router.url);
        if (this.router.url != '/tabs/home') {
          await this.router.navigate(['/tabs/home']);
        } else if (this.router.url === '/tabs/home') {
          if (new Date().getTime() - this.lastTimeBackPress >= this.timePeriodToExit) {
            this.lastTimeBackPress = new Date().getTime();
            this.presentAlertConfirm();
          } else {
            navigator['app'].exitApp();
          }
        }
      });
    });
  }
  
  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      // header: 'Confirm!',
      message: 'Are you sure you want to exit the app?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {}
      }, {
        text: 'Close App',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    });
  }
}

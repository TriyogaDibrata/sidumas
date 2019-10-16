import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SharedService } from 'src/app/services/shared/shared.service';
import { AuthService } from 'src/app/services/auht/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AlertService } from './services/alert/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private sharedService: SharedService,
    private authService: AuthService,
    private commonService: CommonService,
    private alertService : AlertService
  ) {
    this.initializeApp();
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
}

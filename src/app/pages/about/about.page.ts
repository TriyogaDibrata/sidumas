import { Component, OnInit } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  AppName:string;
  PackageName:string;
  VersionCode:string|number;
  VersionNumber:string;

  constructor(
    private appVersion : AppVersion
  ) { }

  ngOnInit() {
    this.appVersion.getAppName().then(value => {
      this.AppName = value;
    }).catch(err => {
      console.log(err);
    });
    this.appVersion.getPackageName().then(value => {
      this.PackageName = value;
    }).catch(err => {
      console.log(err);
    });
    this.appVersion.getVersionCode().then(value => {
      this.VersionCode = value;
    }).catch(err => {
      console.log(err);
    });
    this.appVersion.getVersionNumber().then(value => {
      this.VersionNumber = value;
    }).catch(err => {
      console.log(err);
    });
  }

}

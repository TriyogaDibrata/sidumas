import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { ModalPlacesPageModule } from './modal-places/modal-places.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { GoogleMaps } from '@ionic-native/google-maps/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { ModalImagePageModule } from './modal-image/modal-image.module';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { File } from '@ionic-native/file/ngx';

//component
import { HomePopoverComponent } from './components/home-popover/home-popover.component';
import { ImagePopoverComponent } from './components/image-popover/image-popover.component';

@NgModule({
  declarations: [AppComponent, HomePopoverComponent, ImagePopoverComponent],
  entryComponents: [HomePopoverComponent, ImagePopoverComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    ModalImagePageModule,
    ModalPlacesPageModule],
  providers: [
    StatusBar,
    SplashScreen,
    CameraPreview,
    Camera,
    GoogleMaps,
    Geolocation,
    NativeGeocoder,
    CallNumber,
    SocialSharing,
    Toast,
    Crop,
    Facebook,
    AppVersion,
    AppRate,
    File,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

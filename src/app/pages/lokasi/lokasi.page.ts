import { Component, OnInit } from '@angular/core';
import { GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment } from '@ionic-native/google-maps/ngx';
import { ActivatedRoute } from '@angular/router';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-lokasi',
  templateUrl: './lokasi.page.html',
  styleUrls: ['./lokasi.page.scss'],
})
export class LokasiPage implements OnInit {

  map     : GoogleMap;
  lat     : any;
  lng     : any;
  address : string;

  constructor(private route           : ActivatedRoute,
              private nativeGeocoder  : NativeGeocoder,
              private alertService    : AlertService,) { }

  async ngOnInit() {
    this.lat = this.route.snapshot.paramMap.get('lat');
    this.lng = this.route.snapshot.paramMap.get('lng');
    this.geocoder(this.lat, this.lng);
  }
  
  ionViewWillEnter(){
    this.initMap();
  }

  geocoder(lat, lng){
    let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(lat, lng, options)
      .then((result: NativeGeocoderResult[]) => 
      {
        this.address = this.generateAddress(result[0]);
      }).catch((error: any) => console.log(error));
  }

  //Return Comma saperated address
  generateAddress(addressObj){
      let obj = [];
      let address = "";
      for (let key in addressObj) {
        obj.push(addressObj[key]);
      }
      obj.reverse();
      for (let val in obj) {
        if(obj[val].length)
        address += obj[val]+', ';
      }
    return address.slice(0, -2);
  }

  initMap (){
    let mapOptions: GoogleMapOptions = {
      camera: {
         target: {
           lat: this.lat,
           lng: this.lng
         },
         zoom: 18,
         tilt: 30
       }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    let marker: Marker = this.map.addMarkerSync({
      title: this.address,
      icon: 'red',
      animation: 'DROP',
      position: {
        lat: this.lat,
        lng: this.lng
      }
    });

    // marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
    //   this.alertService.presentAlert('Lokasi', this.address);
    // });
  }

}

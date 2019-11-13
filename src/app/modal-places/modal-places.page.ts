import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ModalController, NavController, Platform, LoadingController } from '@ionic/angular';
import { AlertService } from '../services/alert/alert.service';
import { Storage } from '@ionic/storage';
import { GoogleMaps } from '@ionic-native/google-maps/ngx';
import { AuthService } from '../services/auht/auth.service';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { SharedService } from 'src/app/services/shared/shared.service';

declare var google;

@Component({
  selector: 'app-modal-places',
  templateUrl: './modal-places.page.html',
  styleUrls: ['./modal-places.page.scss'],
})
export class ModalPlacesPage implements OnInit {

  @ViewChild('map', {static : false}) mapElement: ElementRef;

  map: any;
  markers: any;
  autocomplete: any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any
  autocompleteItems: any;
  lat: any;
  lng: any;
  loading: any;
  address: any;
  user: any;
  kategori: any;
  subkategori: any;
  hide_identity: boolean = false;
  hide_report: boolean = false;
  pengaduan: any = {};
  token: any;

  constructor(public modalCtrl      : ModalController,
    private alert                   : AlertService,
    private navCtrl                 : NavController,
    private storage                 : Storage,
    private geolocation             : Geolocation,
    public plt                      : Platform,
    public googleMaps               : GoogleMaps,
    public loadingCtrl              : LoadingController,
    public zone                     : NgZone,
    private authService             : AuthService,
    private router                  : Router,
    private sharedService           : SharedService,
  ) {
      this.geocoder = new google.maps.Geocoder;
      let elem = document.createElement("div")
      this.GooglePlaces = new google.maps.places.PlacesService(elem);
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
      this.autocomplete = {
        input: ''
      };
      this.autocompleteItems = [];
      this.markers = [];
      this.loading = this.loadingCtrl.create(this.sharedService.loadingOption);

      this.map = null;
      this.pengaduan.address = this.address;
    }

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.showLoading();
    this.tryGeolocation();
    this.initMap();
  }

  async initMap() {
    let latLng = new google.maps.LatLng(-8.6027717, 115.1764153);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  tryGeolocation() {
    this.clearMarkers();//remove previous markers

    this.geolocation.getCurrentPosition().then((resp) => {
      this.loading.dismiss();
      console.log(resp.coords.latitude, resp.coords.longitude);
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      console.log(this.lat, this.lng);
      let pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      let marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        title: 'I am here!',
        draggable: true
      });

      this.markers.push(marker);
      this.map.setCenter(pos);
      this.getMarkerPosition(pos);
      this.addMarker(pos);

    }).catch((error) => {
      console.log('Error getting location', error);
      this.loading.dismiss();
    });
  }

  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        if (predictions) {
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
      });
  }

  async selectSearchResult(item) {
    this.clearMarkers();
    this.autocompleteItems = [];

    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        let marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map,
          animation: google.maps.Animation.DROP,
          draggable: true
        })
        this.markers.push(marker);
        this.map.setCenter(results[0].geometry.location);
        this.getMarkerPosition(results[0].geometry.location);
        this.addMarker(results[0].geometry.location);
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
        console.log(this.lat, this.lng);
      }
    })

  }

  addMarker(latLng) {
    this.clearMarkers();
    let marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: latLng
    })
    this.markers.push(marker);
    google.maps.event.addListener(marker, 'dragend', () => {
      this.getMarkerPosition(marker.getPosition());
      this.lat = marker.getPosition().lat();
      this.lng = marker.getPosition().lng();
      console.log(this.lat, this.lng);
    });
  }

  getMarkerPosition(latlng) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, (results, status) => {
      this.address = results[0].formatted_address;
      console.log(this.address);
    })
  }

  clearMarkers() {
    for (var i = 0; i < this.markers.length; i++) {
      console.log(this.markers[i]);
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  async closeModal(){
    let data = {
      'lat' : this.lat,
      'lng' : this.lng
    }
    await this.modalCtrl.dismiss(data);
  }

  async showLoading(){
    this.loading = await this.loadingCtrl.create(this.sharedService.loadingOption);

    await this.loading.present();
  }

}

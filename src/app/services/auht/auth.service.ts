import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../env/env.service';
import { Storage } from '@ionic/storage';
import { tap } from 'rxjs/operators';
import { CommonService } from '../common/common.service';
import { Facebook } from '@ionic-native/facebook/ngx';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token       : any;
  isLoggedIn  : boolean = false;
  FB_APP_ID   : number = 2745787252127370;

  constructor(
    private http            : HttpClient,
    private env             : EnvService,
    private storage         : Storage,
    public commonService    : CommonService,
    public alertService     : AlertService,
    public fb               : Facebook,
  ) {
  }


  login(email: String, password: String) {
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin' : '*',
      'Content-Type' : 'application/json',
      'Accept' : 'application/json'
    });

    return this.http.post(this.env.API_URL + 'login',
    {email : email, password : password}, {headers : headers})
    .pipe(
      tap(data => {
        console.log(data['token']);
        this.storage.set('token', data['token'])
        .then(
          () => {
            console.log('Token Disimpan')
          }, err => console.log('Token Gagal Disimpan')
        );
        this.token = data['token'];
        this.isLoggedIn = true;
        return data['token'];
      }, err => {
        console.log(err);
      })
    )
  }

  register(name: String, no_telp: Number, email: String, password: String, c_password: String){
    return this.http.post(this.env.API_URL + 'register',
    {name : name, email: email, no_telp : no_telp, password : password, password_confirmation : c_password})
  }

  getToken(){
    return this.storage.get('token')
    .then(data => {
      this.token = data;
      console.log(data);
      if(this.token != null){
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    }, err => {
      console.log(err);
      this.token = null;
      this.isLoggedIn = false;
    })
  }

  socialMediaLogin(name: String, email: String, social_media: String, social_id: String, avatar: String) {
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post(this.env.API_URL + 'socialmedialogin',
      {name: name, email: email, social_media: social_media, social_id: social_id, avatar: avatar}, {headers: headers}
    ).pipe(
      tap(data => {
        console.log(data);
        this.storage.set('token', data['token'])
        .then(
          () => {
            console.log('Token Stored');
          },
          error => console.error('Error storing item', error)
        );
        this.token = data['token'];
        this.isLoggedIn = true;
        return data['token'];
      }, err => {
        console.log(err);
      }),
    );
  }

  logout(){
    return this.storage.remove('token')
    .then(
      ()=> {
        this.storage.clear();
        this.isLoggedIn = false;
        this.token = null;
        this.commonService.goTo('login');
      }, err => {
        console.log(err);
      });
  }

  doFbLogout(){
		return this.fb.logout()
		.then(res =>{
			this.storage.remove('token')
    .then(
      ()=> {
        this.storage.clear();
        this.isLoggedIn = false;
        this.token = null;
        this.commonService.goTo('login');
      }, err => {
        console.log(err);
      });
		}, error =>{
			console.log(error);
		});
	}

}
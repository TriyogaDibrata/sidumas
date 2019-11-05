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
    private fb              : Facebook,
    public alertService     : AlertService,
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

  fbLogin(){
    const permissions = ["public_profile", "email"];

    this.fb.login(permissions)
    .then(response => {
      let UserId = response.authResponse.userID;
      
      this.fb.api("/me?fields=name,email", permissions)
      .then(user => {
        user.picture = "https://graph.facebook.com/" + UserId + "/picture?type=large";
        let sm_type = 'facebook';

        if (user){
          return this.socialMediaLogin(user.name, user.email, sm_type, user.id, user.picture);
        }
        this.alertService.presentAlert('Berhasil', JSON.stringify(user));
      })

    }, err => {
      this.alertService.presentAlert('error', JSON.stringify(err));
    });
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
      tap(user => {
        console.log(user);
        this.storage.set('user', user)
        .then(
          () => {
            console.log('Token Stored');
          },
          error => console.error('Error storing item', error)
        );
        this.isLoggedIn = true;
        return user;
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

}
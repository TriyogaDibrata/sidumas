import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../env/env.service';
import { Storage } from '@ionic/storage';
import { tap } from 'rxjs/operators';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token       : any;
  isLoggedIn  : boolean = false;

  constructor(
    private http            : HttpClient,
    private env             : EnvService,
    private storage         : Storage,
    public commonService    : CommonService,
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

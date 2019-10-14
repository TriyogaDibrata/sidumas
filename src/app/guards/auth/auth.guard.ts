import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auht/auth.service';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private router       : Router,
    private authService  : AuthService,
    private navCtrl      : NavController,
    private storage      : Storage,
  ) {}

  canActivate(
    next    : ActivatedRouteSnapshot,
    state   : RouterStateSnapshot
  ) : Observable<boolean> | Promise<boolean> | boolean {
    const currentUser = this.authService.isLoggedIn;
    if(currentUser){
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }
}

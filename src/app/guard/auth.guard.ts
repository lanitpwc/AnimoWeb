import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * @param route
   * @param state
   * @returns {boolean}
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let val: boolean = false
    let auth: string
    auth = localStorage.getItem('auth')
    if(auth){
      if(auth === 'true'){
        val = true
      }else{
        val = false
      }
    }else{
      val = false
    }
    return val
  }
}

import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // console.log('in AuthGuard of Admin');
    // console.log(localStorage.getItem('admin'));
    if (localStorage.getItem('admin')) {
      // console.log('authSer', this.authService.currentUser.value);
      // return !JSON.parse(localStorage.getItem('admin')).emailVerified;
      this.router.navigate(['admin']);
      return false;
    }

    console.log('returned true');
    return true;
  }

}

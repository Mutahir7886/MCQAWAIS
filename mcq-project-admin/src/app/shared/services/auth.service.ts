import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {BehaviorSubject} from 'rxjs';
import {FirebaseApp} from '@angular/fire';
import {auth} from 'firebase/app';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  adminData = new BehaviorSubject<any>(null);
  toWait = false;

  constructor(private afAuth: AngularFireAuth,
              private afStore: AngularFirestore,
              private firebaseAdmin: FirebaseApp,
              private router: Router) {

    const admin = JSON.parse(localStorage.getItem('admin'));
    if (admin) {
      this.adminData.next(admin);
    }

    this.afAuth.authState.subscribe((next) => {
      this.adminData.next(next);
      if (this.adminData.value) {
        if (!this.toWait) {
          localStorage.setItem('admin', JSON.stringify(this.adminData.value));
          router.navigate(['admin']);
        }
      } else {
        localStorage.removeItem('admin');
        router.navigate(['auth']);
      }
    });
  }

  AdminLogin(formValue: any): Promise<boolean> {
    // console.log('in AdminLogin');
    // console.log(formValue);
    this.toWait = true;
    return new Promise<any>((resolve, reject) => {
      this.afStore.collection('admin').valueChanges()
        .pipe(take(1)).subscribe((adminObject: any) => {
        // console.log('adminObject', adminObject);
        const adminKey = adminObject[0].admin_key;
        // console.log('adminKey', adminKey);
        this.afAuth.signInWithEmailAndPassword(formValue.email, formValue.password)
          .then((result) => {
            // console.log('userKey', result.user.uid);
            if (adminKey === result.user.uid) {
              resolve(true);
              this.toWait = false;
            } else {
              this.Logout();
              reject('Invalid Credentials.');
            }
          })
          .catch((error) => {
            reject('Invalid Credentials.');
          });
      }, fireStoreError => {
        reject('Cannot access the database at the moment');
      });

    });
  }

  Logout(): Promise<any> {
    return this.afAuth.signOut();
  }
}

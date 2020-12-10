import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {AuthService} from './shared/services/auth.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  // adminData = null;

  // constructor(private router: Router,
  //             private authService: AuthService,
  //             private elementRef: ElementRef,
  //             private toastr: ToastrService) {
  // }

  constructor(private elementRef: ElementRef) {
  }

  ngAfterViewInit(): void {
    // setting background color of the entire body
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'Var(--background-dark)';
  }

  ngOnInit(): void {
  }

  // ngOnInit(): void {
  //   console.log('in ngOnInit of appComponent');
  //   this.authService.adminData.subscribe(result => {
  //     this.adminData = result;
  //     console.log('adminData in appComponent', this.adminData);
  //   });
  //
  //   this.router.events.subscribe((evt) => {
  //     if (!(evt instanceof NavigationEnd)) {
  //       return;
  //     }
  //     window.scrollTo(0, 0);
  //   });
  //
  // }
  //
  // logout(): void {
  //   this.authService.Logout()
  //     .then((result) => {
  //       this.toastr.success('You have successfully Logged Out.', 'Logout Successful');
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }
}

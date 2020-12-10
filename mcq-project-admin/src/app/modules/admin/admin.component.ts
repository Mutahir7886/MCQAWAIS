import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AdminQuizService} from '../../shared/services/admin-quiz.service';
import {navItems} from '../../_nav';
import {ToastrService} from 'ngx-toastr';
import {NavigationEnd, Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {
  adminData = null;
  showUnSaveQuizAlert = false;

  sidebarMinimized = false;
  navItems = navItems;

  toggleMinimize(e): void {
    this.sidebarMinimized = e;
  }

  constructor(private router: Router,
              private authService: AuthService,
              private toastr: ToastrService,
              private quizService: AdminQuizService) {
  }


  ngOnInit(): void {
    this.quizService.getUnsavedQuizObservable().subscribe(val => {
      this.showUnSaveQuizAlert = val;
    });
    this.quizService.unsavedQuiz.next(!!localStorage.getItem('quiz'));

    console.log('in ngOnInit of appComponent');
    this.authService.adminData.subscribe(result => {
      this.adminData = result;
      console.log('adminData in appComponent', this.adminData);
    });


    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

  }

  logout(): void {
    this.authService.Logout()
      .then((result) => {
        this.toastr.success('You have successfully Logged Out.', 'Logout Successful');
      })
      .catch((error) => {
        console.log(error);
      });
  }

}

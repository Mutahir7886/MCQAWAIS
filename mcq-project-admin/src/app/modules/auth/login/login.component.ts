import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loaderColor = 'whitesmoke';

  loginForm: FormGroup;

  isLoggingIn = false;

  constructor(private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [
        Validators.required,
        Validators.maxLength(20),
        Validators.minLength(8)]]
    });
  }

  login(form: FormGroup): void {
    this.isLoggingIn = true;
    this.authService.AdminLogin(form.value).then((result) => {
      console.log('success');
      this.isLoggingIn = false;
      this.loginForm.reset();
      this.toastr.success('You have successfully Logged In.', 'Login Successful');
    }).catch((error) => {
      console.log('login error', error);
      this.isLoggingIn = false;
      this.toastr.error(error);
    });
  }

}

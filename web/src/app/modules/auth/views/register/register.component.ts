import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private snackService: SnackBarService
  ) { }

  ngOnInit(): void {
  }

  registerForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    repeat_password: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    displayName: ['', Validators.required]
  })

  async register() {
    const username = this.registerForm.get('username')?.value;
    const password = this.registerForm.get('password')?.value;
    const email = this.registerForm.get('email')?.value;
    const displayName = this.registerForm.get('displayName')?.value;

    const registerData = {
      username,
      password,
      email,
      displayName
    }

    const result = await this.authService.register(registerData);

    //TODO add result validation, notification and redirect(immediate login?)

    this.snackService.openSuccess('Registration succesfull. You can sign in with newly registered user.');

    this.router.navigate(['auth', 'login'])

    return result;
  }

}

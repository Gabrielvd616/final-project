import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  public firstName = '';
  public lastName = '';
  public email = '';
  public password = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.authService
      .registerUser({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
      })
      .subscribe(
        (res: any) => {
          if (res.error) {
            this.router
              .navigateByUrl('', { skipLocationChange: true })
              .then(() => {
                this.router.navigateByUrl('/signup', {
                  state: {
                    error: res.error,
                  },
                });
              });
          } else if (res.success) {
            this.router.navigateByUrl('/login', {
              state: {
                success: res.success,
              },
            });
          }
        },
        (err: any) => {
          this.router.navigateByUrl('/error', {
            state: {
              sendError: {
                status: err.error.sendError.status || err.status,
                message: err.error.sendError.message || err.statusText,
              },
            },
          });
        }
      );
  }
}

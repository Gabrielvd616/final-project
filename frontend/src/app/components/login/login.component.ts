import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public email = '';
  public password = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.authService
      .loginUser({
        email: this.email,
        password: this.password,
      })
      .subscribe(
        (res: any) => {
          if (res.error) {
            this.router
              .navigateByUrl('', { skipLocationChange: true })
              .then(() => {
                this.router.navigateByUrl('/login', {
                  state: {
                    error: res.error,
                  },
                });
              });
          } else if (res.success) {
            this.router.navigateByUrl('/dashboard', {
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

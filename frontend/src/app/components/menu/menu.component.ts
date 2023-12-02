import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  public isCurrentlyLoggedIn = false;
  private subscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    this.subscription = this.authService.getLoginStatus().subscribe((val) => {
      this.isCurrentlyLoggedIn = val;
    });
  }

  ngOnInit(): void {}

  onLogout(): void {
    this.authService.logoutUser().subscribe(
      (res: any) => {
        this.authService.resetWasLoggedIn();
        if (res.error || res.success) {
          this.router
            .navigateByUrl('/error', { skipLocationChange: true })
            .then(() => {
              this.router.navigateByUrl('/', {
                state: {
                  error: res.error,
                  success: res.success,
                },
              });
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

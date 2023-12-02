import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  public showNotification: boolean = false;
  private wasNotified: boolean = false;
  private promptSubscription: Subscription;
  private redirectSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((res: any) => {
      if (res.status) {
        this.authService.setWasLoggedIn();
        if (res.timeout > 20) {
          this.promptSubscription = interval(
            (res.timeout - 20) * 1000
          ).subscribe((val) => {
            if (!this.wasNotified) {
              this.wasNotified = true;
              this.showNotification = true;
            }
          });
        }
        this.redirectSubscription = interval(res.timeout * 1000).subscribe(
          (val) => {
            if (
              this.authService.checkIfWasLoggedIn() &&
              ['/dashboard', '/edit', '/add'].includes(this.router.url)
            ) {
              this.authService.resetWasLoggedIn();
              this.router.navigateByUrl('/');
            } else {
              this.authService.resetWasLoggedIn();
              this.ngOnDestroy();
            }
          }
        );
      }
    });
  }

  ngOnDestroy() {
    if (this.promptSubscription) {
      this.promptSubscription.unsubscribe();
    }
    if (this.redirectSubscription) {
      this.redirectSubscription.unsubscribe();
    }
  }

  onClose(): void {
    this.showNotification = false;
  }
}

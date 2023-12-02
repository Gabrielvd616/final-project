import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent implements OnInit {
  public title: string = '';
  public budget: number;
  public spend: number;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.dataService
      .createItem({
        title: this.title,
        budget: this.budget,
        spend: this.spend,
      })
      .subscribe(
        (res: any) => {
          if (res.error) {
            this.router
              .navigateByUrl('', { skipLocationChange: true })
              .then(() => {
                this.router.navigateByUrl('/add', {
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
          console.log('Error:', err);
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

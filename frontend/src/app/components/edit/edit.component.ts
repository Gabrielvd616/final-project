import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  public title: string = '';
  public budget: number = 0;
  public spend: number = 0;
  private id: number = -1;

  constructor(private dataService: DataService, private router: Router) {
    this.title = history.state.title;
    this.budget = history.state.budget;
    this.spend = history.state.spend;
    this.id = history.state.id;
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.dataService
      .updateItem({
        title: this.title,
        budget: this.budget,
        spend: this.spend,
        id: this.id,
      })
      .subscribe(
        (res: any) => {
          if (res.error) {
            this.router
              .navigateByUrl('', { skipLocationChange: true })
              .then(() => {
                this.router.navigateByUrl('/edit', {
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

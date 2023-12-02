import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data/data.service';
import Chart from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public chart: any;
  public hasItems: boolean = true;
  public labelset: any = [];
  public budgetset: any = [];
  public spendset: any = [];
  private idset: any = [];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.dataService.getItems().subscribe(
      (res: any) => {
        if (res.error) {
          this.router.navigateByUrl('/error', {
            state: {
              error: res.error,
            },
          });
        } else {
          this.hasItems = res.length > 0;
          for (var i = 0; i < res.length; i++) {
            this.labelset.push(res[i].title);
            this.budgetset.push(res[i].budget);
            this.spendset.push(res[i].spend);
            this.idset.push(res[i].id);
          }
          if (this.hasItems) {
            this.createPieChart();
            this.createBarChart();
          }
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

  createPieChart() {
    this.chart = new Chart('PieChart', {
      type: 'pie',
      // type: 'doughnut',
      data: {
        labels: this.labelset,
        datasets: [
          {
            data: this.budgetset,
            backgroundColor: this.generateColorArray(this.budgetset.length),
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 2,
      },
    });
  }

  generateColorArray(expectedSize: number): Array<string> {
    let arr: Array<string> = [];
    let colors = [
      '#ffcd56',
      '#ff6384',
      '#36a2eb',
      '#fd6b19',
      '#41c92c',
      '#7452ff',
      '#63dbd9',
    ];
    for (let i = 0; i < expectedSize; i++) {
      arr.push(colors[(i + Math.floor(i / colors.length)) % colors.length]);
    }
    return arr;
  }

  createBarChart() {
    this.chart = new Chart('BarChart', {
      type: 'bar', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: this.labelset,
        datasets: [
          {
            label: 'Budget',
            data: this.budgetset,
            backgroundColor: 'blue',
          },
          {
            label: 'Spend',
            data: this.spendset,
            backgroundColor: 'limegreen',
          },
        ],
      },
      options: {
        aspectRatio: 2,
      },
    });
  }

  onEdit(i: number) {
    this.router.navigateByUrl('edit', {
      state: {
        title: this.labelset[i],
        budget: this.budgetset[i],
        spend: this.spendset[i],
        id: this.idset[i],
      },
    });
  }

  onDelete(i: number) {
    this.dataService.deleteItem(this.idset[i]).subscribe(
      (res: any) => {
        if (res.error || res.success) {
          this.router
            .navigateByUrl('', { skipLocationChange: true })
            .then(() => {
              this.router.navigateByUrl('/dashboard', {
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

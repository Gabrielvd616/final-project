import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent implements OnInit {
  public status = '404';
  public message = 'Page not found.';

  constructor() {
    if (history.state.sendError) {
      this.status = history.state.sendError.status;
      this.message = history.state.sendError.message;
    }
  }

  ngOnInit(): void {}
}

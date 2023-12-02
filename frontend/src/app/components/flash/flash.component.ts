import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flash',
  templateUrl: './flash.component.html',
  styleUrls: ['./flash.component.css'],
})
export class FlashComponent implements OnInit {
  public flashNotifications = false;
  public errorMessages = [];
  public successMessages = [];

  constructor() {
    if (history.state.error || history.state.success) {
      this.flashNotifications = true;
      this.errorMessages = history.state.error;
      this.successMessages = history.state.success;
    }
  }

  ngOnInit(): void {}
}

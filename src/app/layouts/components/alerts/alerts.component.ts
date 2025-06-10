import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css'
})
export class AlertsComponent {
  @Input() message: string = '';
  @Input() type: string = 'success';
  show: boolean = false;

  showAlert(messagge: string, type: string = 'success') {
    this.message = messagge;
    this.type = type;
    this.show = true;
    setTimeout(() => {
      this.close();
    }, 4000);
  }

  close() {
    this.show = false;
  }
}

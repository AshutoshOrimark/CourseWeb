import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-wesite-footer',
  imports: [],
  templateUrl: './wesite-footer.component.html',
  styleUrl: './wesite-footer.component.css'
})
export class WesiteFooterComponent {
  appName = environment.appName;
  currentYear: number = new Date().getFullYear();
  constructor() {
    this.currentYear = new Date().getFullYear();
  }
}

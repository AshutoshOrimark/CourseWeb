import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-website-aboutus',
  imports: [],
  templateUrl: './website-aboutus.component.html',
  styleUrl: './website-aboutus.component.css'
})
export class WebsiteAboutusComponent {
  appName = environment.appName;
}

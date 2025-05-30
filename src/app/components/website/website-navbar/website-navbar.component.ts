import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-website-navbar',
  templateUrl: './website-navbar.component.html',
  styleUrls: ['./website-navbar.component.css'],
  imports:[CommonModule, RouterLink],
})
export class WebsiteNavbarComponent {
  isNavbarCollapsed = true; // Initially collapsed
  appName = environment.appName;
}

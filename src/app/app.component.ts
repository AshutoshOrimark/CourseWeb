import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, RouterOutlet } from '@angular/router';
import { PageLoaderComponent } from './components/page-loader/page-loader.component';
import { environment } from '../environments/environment';
import { Title } from '@angular/platform-browser';

declare var feather: any;
declare var bootstrap: any;

@Component({
  selector: 'app-root',
  imports: [PageLoaderComponent,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {  
  @ViewChild(PageLoaderComponent) loader!: PageLoaderComponent;

  constructor(private router: Router,private titleService: Title) {
    this.titleService.setTitle(environment.appName);
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.loader) {
          this.loader.showLoader();
        }
      } else if (event instanceof NavigationEnd) {
        if (this.loader) {
          // Show loader for at least 1 second for smooth transition
          setTimeout(() => {
            this.loader.hideLoader();
          }, 1000);
        }

        this.titleService.setTitle(environment.appName);

        // Reinitialize Feather icons
        if (feather) {
          feather.replace();
        }

        // Reinitialize Bootstrap components
        this.reinitializeBootstrapComponents();
      }
    });
  }

  private reinitializeBootstrapComponents(): void {
    // Reinitialize dropdowns
    const dropdownTriggerList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownTriggerList.forEach(dropdownTriggerEl => {
      new bootstrap.Dropdown(dropdownTriggerEl);
    });

    // Reinitialize collapses
    const collapseTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="collapse"]'));
    collapseTriggerList.forEach(collapseTriggerEl => {
      new bootstrap.Collapse(collapseTriggerEl, { toggle: false });
    });
  }
}

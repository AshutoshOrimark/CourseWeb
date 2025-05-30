import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-page-loader',
  imports: [CommonModule],
  templateUrl: './page-loader.component.html',
  styles: ``
})
export class PageLoaderComponent {
    isLoading: boolean = true;

    // Method to show the loader
    showLoader() {
      this.isLoading = true;
    }

    // Method to hide the loader
    hideLoader() {
      this.isLoading = false;
    }
}

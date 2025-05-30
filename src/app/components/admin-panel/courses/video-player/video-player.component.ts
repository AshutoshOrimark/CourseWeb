import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css'],
  imports: [CommonModule, FormsModule]
})
export class VideoPlayerComponent implements OnInit {
  progress = 'Waiting for updates...';
  isDownloading = false;
  progressPercent = '0%';
  eventSource?: EventSource;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Do nothing here, wait for button click
  }

  startDownload() {
    this.isDownloading = true;
    this.progress = '0';
    this.progressPercent = '0%';

    this.eventSource = new EventSource('http://localhost:8000/media/download');

    this.eventSource.onmessage = (event) => {
      this.isDownloading = true;
      // Example: event.data = receivedLength (number)
      const contentLength = 100; // Replace with actual content length if available
      const receivedLength = parseInt(event.data, 10);
      if (contentLength) {
        this.progress = Math.floor((receivedLength / contentLength) * 100).toString();
        this.progressPercent = `${this.progress}%`;
      }

      if (event.data === 'done') {
        this.eventSource?.close();
        this.isDownloading = false;
        this.progress = 'Download complete!';
      }
      this.cdr.detectChanges();
    };

    this.eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      this.progress = 'Error receiving updates';
      this.cdr.detectChanges();
      this.eventSource?.close();
      this.isDownloading = false;
    };
  }
}

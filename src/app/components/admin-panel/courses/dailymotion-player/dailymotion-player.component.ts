import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dailymotion-player',
  templateUrl: './dailymotion-player.component.html',
  styleUrls: ['./dailymotion-player.component.css'],
  imports: [CommonModule, FormsModule],
})
export class DailymotionPlayerComponent implements OnChanges {
  @Input() dailymotionUrl: string = '';
  safeUrl: SafeResourceUrl | null = null;
  showPlayer = false;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dailymotionUrl']) {
      this.showPlayer = false; // Reset player on URL change
      this.updateSafeUrl();
    }
  }

  updateSafeUrl() {
    if (this.dailymotionUrl) {
      const match = this.dailymotionUrl.match(/video\/([a-zA-Z0-9]+)/);
      const videoId = match ? match[1] : null;
      if (videoId) {
        const embedUrl = `https://www.dailymotion.com/embed/video/${videoId}?autoplay=0&queue-enable=false&endscreen-enable=false`;
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      } else {
        this.safeUrl = null;
      }
    } else {
      this.safeUrl = null;
    }
  }
}

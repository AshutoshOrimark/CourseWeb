import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

declare var YT: any;

@Component({
  selector: 'app-youtube-player',
  templateUrl: './youtube-player.component.html',
  styleUrl: './youtube-player.component.css',
  imports: [CommonModule, FormsModule],
})
export class YoutubePlayerComponent {
  youtubeUrl: string = '';
  videoId: string | null = null; // base64-encoded video ID
  player: any = null;
  isPlaying: boolean = false;
  playbackRate: number = 1;
  volume: number = 100;
  playerReady: boolean = false;
  fullscreenActive: boolean = false;

  @ViewChild('youtubeIframe', { static: false }) youtubeIframe!: ElementRef;
  @ViewChild('playerContainer', { static: false }) playerContainer!: ElementRef;

  constructor(private ngZone: NgZone, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    document.addEventListener('fullscreenchange', () => {
      this.ngZone.run(() => {
        this.fullscreenActive = !!document.fullscreenElement;
      });
    });
  }

  extractVideoId(url: string): string | null {
    const regExp = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&#]*)/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : null;
  }

  onUrlChange() {
    const id = this.extractVideoId(this.youtubeUrl);
    if (id) {
      this.videoId = btoa(id); // base64 encode
    } else {
      this.videoId = null;
    }
    this.youtubeUrl = ''; // Clear the URL for obfuscation
    setTimeout(() => this.loadPlayer(), 0);
  }

  loadPlayer() {
    if (!this.videoId) return;
    if (!(window as any)['YT']) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      (window as any)['onYouTubeIframeAPIReady'] = () => this.createPlayer();
    } else {
      this.createPlayer();
    }
  }

  createPlayer() {
    const realId = this.videoId ? atob(this.videoId) : '';
    if (this.player) {
      this.player.loadVideoById(realId);
      return;
    }
    this.player = new YT.Player(this.youtubeIframe.nativeElement, {
      videoId: realId,
      playerVars: {
        controls: 0,
        rel: 0,
        modestbranding: 1,
        fs: 0,
        iv_load_policy: 3,
        disablekb: 1,
      },
      events: {
        onReady: (event: any) => {
          this.ngZone.run(() => {
            this.isPlaying = false;
            this.playerReady = true;
            this.player.setVolume(this.volume);
            this.player.setPlaybackRate(this.playbackRate);
            // Set to highest available quality
            const qualities = this.player.getAvailableQualityLevels();
            if (qualities && qualities.length) {
              this.player.setPlaybackQuality(qualities[0]);
            }
          });
        },
        onStateChange: (event: any) => {
          this.ngZone.run(() => {
            this.isPlaying = event.data === YT.PlayerState.PLAYING;
          });
        }
      }
    });
  }

  togglePlayPause() {
    if (!this.player || !this.playerReady) return;
    if (this.isPlaying) {
      this.player.pauseVideo();
    } else {
      this.player.playVideo();
    }
  }

  seek(seconds: number) {
    if (!this.player || !this.playerReady) return;
    const currentTime = this.player.getCurrentTime();
    this.player.seekTo(currentTime + seconds, true);
  }

  setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.player && this.playerReady) {
      this.player.setPlaybackRate(rate);
    }
  }

  setVolume(vol: number) {
    this.volume = vol;
    if (this.player && this.playerReady) {
      this.player.setVolume(vol);
    }
  }

  toggleFullscreen() {
    const elem = this.playerContainer.nativeElement;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
    }
  }

  exitFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }
}

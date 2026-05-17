import { CommonModule }                                                      from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IonIcon }                                                                          from '@ionic/angular/standalone';

@Component({
  selector: 'app-upload-media',
  templateUrl: './upload-media.component.html',
  styleUrls: ['./upload-media.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon
  ]
})
export class UploadMediaComponent implements OnDestroy, AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  @Output() uploadMedia: EventEmitter<any> = new EventEmitter();

  fileSrc: string | null = null;
  typeFile: 'image' | 'video' | null = null;

  // Video player states
  isVideoLoaded: boolean = false;
  isPaused: boolean = true;
  currentTime: number = 0;
  duration: number = 0;
  volume: number = 1;
  isMuted: boolean = false;
  showControls: boolean = true;

  private hideControlsTimeout: any;
  private readonly HIDE_CONTROLS_DELAY = 3000;

  ngAfterViewInit(): void {
    if (this.typeFile === 'video' && this.videoElement?.nativeElement) {
      this.setupVideoListeners();
    }
  }

  ngOnDestroy(): void {
    this.clearHideControlsTimeout();
  }

  async selectFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';

    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (!file) return;

      this.typeFile = file.type.startsWith('image') ? 'image' : 'video';
      this.fileSrc = URL.createObjectURL(file);
      this.isVideoLoaded = false;
      this.isPaused = true;
      this.currentTime = 0;
      this.duration = 0;

      this.uploadMedia.emit({ file, preview: this.fileSrc, typeFile: this.typeFile });

      if (this.typeFile === 'video') {
        setTimeout(() => {
          if (this.videoElement?.nativeElement) {
            this.setupVideoListeners();
          }
        }, 100);
      }
    };

    input.click();
  }

  private setupVideoListeners(): void {
    const video = this.videoElement.nativeElement;

    video.addEventListener('loadedmetadata', () => {
      video.currentTime = 0.1;
    }, { once: true });

    video.addEventListener('pause', () => {
      if (video.currentTime === 0) {
        video.currentTime = 0.1;
      }
    });

    video.addEventListener('ended', () => {
      video.currentTime = 0.1;
    });
  }

  onVideoLoadedData(): void {
    this.isVideoLoaded = true;
  }

  removeFile() {
    this.fileSrc = null;
    this.typeFile = null;
    this.isVideoLoaded = false;
    this.clearHideControlsTimeout();
    this.uploadMedia.emit({ file: null, preview: this.fileSrc, typeFile: null });
  }

  togglePlay(video: HTMLVideoElement) {
    if (video.paused) {
      this.playVideo(video);
    } else {
      video.pause();
      this.isPaused = true;
      this.clearHideControlsTimeout();
      this.showControls = true;
    }
  }

  private playVideo(video: HTMLVideoElement) {
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPaused = false;
          this.startHideControlsTimer();
        })
        .catch((error) => {
          console.error('Error al reproducir video:', error);
          this.isPaused = true;
        });
    }
  }

  seekVideo(video: HTMLVideoElement, event: any) {
    video.currentTime = event.target.value;
    this.currentTime = video.currentTime;
    this.resetHideControlsTimer();
  }

  updateProgress(video: HTMLVideoElement) {
    this.currentTime = video.currentTime;
  }

  setDuration(video: HTMLVideoElement) {
    this.duration = video.duration;
  }

  onVideoEnded(video: HTMLVideoElement) {
    video.currentTime = 0.1;
    this.isPaused = true;
    this.showControls = true;
    this.clearHideControlsTimeout();
  }

  toggleMute(video: HTMLVideoElement) {
    this.isMuted = !this.isMuted;
    video.muted = this.isMuted;
    this.resetHideControlsTimer();
  }

  changeVolume(video: HTMLVideoElement, event: any) {
    this.volume = event.target.value;
    video.volume = this.volume;

    if (this.volume > 0 && this.isMuted) {
      this.isMuted = false;
      video.muted = false;
    }

    if (this.volume === 0) {
      this.isMuted = true;
      video.muted = true;
    }

    this.resetHideControlsTimer();
  }

  onVideoClick(video: HTMLVideoElement) {
    this.togglePlay(video);
    this.showControlsTemporarily();
  }

  onControlsInteraction(event: Event) {
    event.stopPropagation();
    this.resetHideControlsTimer();
  }

  showControlsTemporarily() {
    this.showControls = true;
    this.resetHideControlsTimer();
  }

  private startHideControlsTimer() {
    this.clearHideControlsTimeout();
    this.hideControlsTimeout = setTimeout(() => {
      if (!this.isPaused) {
        this.showControls = false;
      }
    }, this.HIDE_CONTROLS_DELAY);
  }

  private resetHideControlsTimer() {
    this.showControls = true;
    if (!this.isPaused) {
      this.startHideControlsTimer();
    }
  }

  private clearHideControlsTimeout() {
    if (this.hideControlsTimeout) {
      clearTimeout(this.hideControlsTimeout);
      this.hideControlsTimeout = null;
    }
  }

  formatTime(seconds: number): string {
    if (!seconds) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  }

  get volumeIcon(): string {
    if (this.isMuted || this.volume === 0) {
      return 'volume-mute';
    } else if (this.volume < 0.5) {
      return 'volume-low';
    } else {
      return 'volume-high';
    }
  }
}

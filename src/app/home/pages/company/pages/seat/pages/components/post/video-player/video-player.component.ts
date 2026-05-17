import { CommonModule }                                                                            from '@angular/common';
import { Component, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IonicModule }                                                                             from '@ionic/angular';
import { SessionService }                                                                          from 'src/app/shared/services/session.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
  ],
  standalone: true
})
export class VideoPlayerComponent implements OnDestroy, AfterViewInit {
  @ViewChild('customVideo') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('posterCanvas') posterCanvas!: ElementRef<HTMLCanvasElement>;

  @Output() viewPost: EventEmitter<any> = new EventEmitter<any>();
  @Input() urlFile: string = '';
  @Input() width: number = 0;
  @Input() height: number = 0;
  @Input() viewPostAction: boolean = false;
  @Input() autoplay: boolean = false;

  isPaused: boolean = true;
  currentTime: number = 0;
  duration: number = 0;
  isLoaded = false;
  volume: number = 1;
  isMuted: boolean = false;
  showControls: boolean = true;

  private hasViewBeenCounted = false;
  private viewThreshold = 0.4;
  private hideControlsTimeout: any;
  private readonly HIDE_CONTROLS_DELAY = 1500;

  constructor(
    public sessionService: SessionService
  ) {}

  ngAfterViewInit() {
    const video = this.videoElement.nativeElement;

    // Cargar el video y capturar el primer frame
    video.addEventListener('loadeddata', () => {
      this.captureFirstFrame();
    }, { once: true });

    // Cargar el video
    video.load();
  }

  private captureFirstFrame() {
    const video = this.videoElement.nativeElement;

    if (this.posterCanvas && video.readyState >= 2) {
      const canvas = this.posterCanvas.nativeElement;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Dibujar el primer frame en el canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      // Después de un pequeño delay, marcar como cargado
      setTimeout(() => {
        this.isLoaded = true;

        // Si autoplay está activado, reproducir
        if (this.autoplay) {
          // Restaurar el mute según la configuración
          video.muted = this.isMuted;
          this.playVideo(video);
        }
      }, 100);
    }
  }

  ngOnDestroy() {
    this.clearHideControlsTimeout();
    this.stop();
  }

  stop() {
    if (this.videoElement?.nativeElement) {
      const video = this.videoElement.nativeElement;
      video.pause();
      this.isPaused = true;
      this.showControls = true;
      this.clearHideControlsTimeout();
    }
  }

  get skeletonHeight(): string {
    if (!this.width || !this.height) return '200px';
    const ratio = this.height / this.width;
    return `${this.width * ratio}px`;
  }

  togglePlay(video: HTMLVideoElement) {
    if (video.paused) {
      // Al reproducir por primera vez, quitar el mute si es necesario
      if (!this.isMuted) {
        video.muted = false;
      }
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
    this.checkViewProgress();
    this.resetHideControlsTimer();
  }

  updateProgress(video: HTMLVideoElement) {
    this.currentTime = video.currentTime;
    this.checkViewProgress();
  }

  setDuration(video: HTMLVideoElement) {
    this.duration = video.duration;
  }

  onVideoEnded(video: HTMLVideoElement) {
    this.checkViewProgress();
    video.currentTime = 0;
    this.playVideo(video);
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

  private checkViewProgress() {
    if (!this.viewPostAction || this.hasViewBeenCounted || this.duration === 0) {
      return;
    }

    const progressPercentage = this.currentTime / this.duration;

    if (progressPercentage >= this.viewThreshold) {
      this.hasViewBeenCounted = true;
      this.viewPost.emit();
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

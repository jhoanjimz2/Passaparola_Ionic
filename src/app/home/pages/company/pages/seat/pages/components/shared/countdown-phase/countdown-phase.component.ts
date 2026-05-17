import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription }              from 'rxjs';

@Component({
  selector: 'app-countdown-phase',
  templateUrl: './countdown-phase.component.html',
  styleUrls: ['./countdown-phase.component.scss'],
  standalone: true
})
export class CountdownPhaseComponent implements OnInit, OnDestroy {
  @Input() targetDate?: Date;

  countdownText = '';
  private sub!: Subscription;

  ngOnInit() {
    if (!this.targetDate) {
      this.countdownText = 'Il tempo è scaduto';
      return;
    }

    this.updateCountdown();

    this.sub = interval(1000).subscribe(() => {
      this.updateCountdown();
    });
  }

  updateCountdown() {
    if (!this.targetDate) {
      this.countdownText = 'Il tempo è scaduto';
      this.sub?.unsubscribe();
      return;
    }

    const now = new Date().getTime();
    const target = new Date(this.targetDate).getTime();
    const distance = target - now;

    if (distance <= 0) {
      this.countdownText = 'Il tempo è scaduto';
      this.sub?.unsubscribe();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);

    this.countdownText = `${days}d ${hours}h ${minutes}m`;
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}

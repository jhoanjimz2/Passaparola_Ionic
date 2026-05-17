import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { IonContent, IonFooter, IonIcon, IonRange, IonToolbar }     from '@ionic/angular/standalone';
import { HeaderComponent }                                          from '../../components/header/header.component';
import { ActivatedRoute }                                           from '@angular/router';
import { CommonModule }                                             from '@angular/common';
import { Willbuy }                                                  from 'src/app/shared/interfaces/jointlybuy/willbuy';
import { JointlybuyService }                                        from 'src/app/shared/services/jointlybuy.service';
import { map, Observable, Subscription, switchMap, take }           from 'rxjs';
import { FormattNumberPipe }                                        from 'src/app/shared/pipes';
import { CustomDatePipe }                                           from 'src/app/shared/pipes/custom-date.pipe';
import { CleanUrlPipe }                                             from 'src/app/shared/pipes/clean-url.pipe';
import { ModalController, NavController }                           from '@ionic/angular';
import { ModalBuyWillbuyComponent }                                 from '../../components/modal-buy-willbuy/modal-buy-willbuy.component';
import { ModalActionNotValidComponent }                             from 'src/app/components/modal-action-not-valid/modal-action-not-valid.component';
import { ModalShareLinkComponent }                                  from 'src/app/components/modal-share-link/modal-share-link.component';

@Component({
  selector: 'app-view-willbuy',
  templateUrl: './view-willbuy.page.html',
  styleUrls: ['./view-willbuy.page.scss'],
  standalone: true,
  imports: [
    IonRange,
    IonContent,
    HeaderComponent,
    CommonModule,
    IonIcon,
    IonFooter,
    IonToolbar,
    FormattNumberPipe,
    CustomDatePipe,
    CleanUrlPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewWillbuyPage {
  @ViewChild('swiperLinks') swiperLinks?: ElementRef;
  @ViewChild('swiperGallery') swiperGallery?: ElementRef;
  id: string = '';

  willbuy: Willbuy = {} as Willbuy;
  subscriptions: Subscription[] = [];

  daysRemaining: number = 0;
  hoursRemaining: number = 0;
  minutesRemaining: number = 0;
  secondsRemaining: number = 0;

  isPublic: boolean = false;

  private countdownInterval?: ReturnType<typeof setInterval>;


  constructor(
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private jointlybuyService: JointlybuyService
  ) {
    this.autoSubscribe(this.jointlybuyService.willbuy(), v => {
      this.willbuy = v;
    });
  }

  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void) {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  ngOnInit(): void {
    this.initializeRouteParams();
  }

  ngAfterViewInit() {
    if (this.swiperLinks) {
      const swiperEl = this.swiperLinks.nativeElement;
      Object.assign(swiperEl, {
        slidesPerView: 'auto',
        spaceBetween: 16,
      });
      swiperEl.initialize();
    }
    if (this.swiperGallery) {
      const swiperGallery = this.swiperGallery.nativeElement;
      Object.assign(swiperGallery, {
        slidesPerView: 'auto',
        pagination: true,
        navigation: true
      });
      swiperGallery.initialize();
    }
  }

  private initializeRouteParams(): void {
    this.route.queryParams.pipe(
      switchMap((queryParams) => {
        return this.route.paramMap.pipe(
          map(paramMap => ({ queryParams, paramMap }))
        );
      }),
      take(1)
    ).subscribe(({ queryParams, paramMap }) => {
      this.isPublic = queryParams['public'] === 'true';
      this.id = paramMap.get('id')!;
      if (!this.isPublic) {
        if (this.id === this.willbuy.id) return;
        this.jointlybuyService.loadWillbuyForId(this.id).subscribe({
          next: () => this.startCountdown(),
          error: (err) => this.navCtrl.back()
        });
      } else {
        this.jointlybuyService.loadWillbuyForIdPublic(this.id).subscribe({
          next: () => this.startCountdown(),
          error: (err) => this.navCtrl.navigateForward(['/login'])
        });
      }
    });
  }

  private startCountdown() {
    if (!this.willbuy.buyIn || !this.willbuy.buyEnd) {
      return;
    }
    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  private updateCountdown() {
    const now = new Date().getTime();
    const buyInDate = new Date(this.willbuy.buyIn!).getTime();
    const buyEndDate = new Date(this.willbuy.buyEnd!).getTime();

    let targetDate: number;

    if (now < buyInDate) {
      targetDate = buyInDate;
    }
    else if (now < buyEndDate) {
      targetDate = buyEndDate;
    }
    else {
      this.daysRemaining = 0;
      this.hoursRemaining = 0;
      this.minutesRemaining = 0;
      this.secondsRemaining = 0;

      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }
      return;
    }
    const difference = targetDate - now;

    if (difference > 0) {
      this.daysRemaining = Math.floor(difference / (1000 * 60 * 60 * 24));
      this.hoursRemaining = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutesRemaining = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      this.secondsRemaining = Math.floor((difference % (1000 * 60)) / 1000);
    } else {
      this.daysRemaining = 0;
      this.hoursRemaining = 0;
      this.minutesRemaining = 0;
      this.secondsRemaining = 0;
    }
  }

  getSoldUnits(): number {
    if (!this.willbuy.willbuyTransactions || this.willbuy.willbuyTransactions.length === 0) {
      return 0;
    }

    return this.willbuy.willbuyTransactions.reduce((total, transaction) => {
      return total + (transaction.quantity || 0);
    }, 0);
  }

  getSortedPhases() {
    if (!this.willbuy.purchaseDiscounts || this.willbuy.purchaseDiscounts.length === 0) {
      return [];
    }
    return [...this.willbuy.purchaseDiscounts].sort((a, b) =>
      (a.quantity || 0) - (b.quantity || 0)
    );
  }

  get getCurrentPhase() {
    if (!this.willbuy.purchaseDiscounts || this.willbuy.purchaseDiscounts.length === 0) {
      return null;
    }
    const sortedPhases = [...this.willbuy.purchaseDiscounts].sort((a, b) =>
      (a.minimumPurchaseUnits || 0) - (b.minimumPurchaseUnits || 0)
    );
    const soldUnits = this.getSoldUnits();
    const currentPhase = sortedPhases.find(phase =>
      soldUnits < (phase.minimumPurchaseUnits || 0)
    );
    return currentPhase || sortedPhases[sortedPhases.length - 1];
  }
  isActivePhase(phase: any): boolean {
    if (!phase) {
      return false;
    }
    const soldUnits = this.getSoldUnits();
    const phases = this.getSortedPhases();
    const currentIndex = phases.findIndex(p =>
      p.minimumPurchaseUnits === phase.minimumPurchaseUnits
    );
    if (currentIndex === -1) {
      return false;
    }
    const currentMinimum = phase.minimumPurchaseUnits || 0;
    if (currentIndex === phases.length - 1) {
      return soldUnits >= currentMinimum;
    }
    const nextMinimum = phases[currentIndex + 1].minimumPurchaseUnits || 0;
    return soldUnits >= currentMinimum && soldUnits < nextMinimum;
  }
  getPhaseRange(phase: any, index: number, totalPhases: number): string {
    const phases = this.getSortedPhases();
    const currentMinimum = phase.minimumPurchaseUnits || 0;
    if (index === totalPhases - 1) {
      return `${currentMinimum}>`;
    }
    const nextMinimum = phases[index + 1].minimumPurchaseUnits || 0;
    return `${currentMinimum}-${nextMinimum - 1}`;
  }

  openExternalLink(url: string): void {
    if (this.isPublic) {
      this.actionNotValid()
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async shareWillbuy() {
    if (this.isPublic) {
      this.actionNotValid()
      return;
    }
    const shareUrl = `https://passaparola.app/view-willbuy/${this.willbuy.id}?public=true`;
    const modal = await this.modalCtrl.create({
      component: ModalShareLinkComponent,
      componentProps: {
        shareUrl: shareUrl,
        shareText: `Ciao come va?
Cercavo qualche acquisto a buon prezzo su JointlyBuy, ho trovato questo e mi ha fatto pensare a te. Dimmi che ne pensi.
Ci sentiamo presto`
      },
      cssClass: 'modal-full-screen'
    });

    await modal.present();
  }

  async openModalBuyWillbuy() {
    if (this.isPublic) {
      this.actionNotValid()
      return;
    }
    const modal = await this.modalCtrl.create({
      component: ModalBuyWillbuyComponent,
      componentProps: {
        id: this.willbuy.id
      },
      cssClass: ['radius-modals', 'modal-85vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1
    });
    await modal.present();
  }

  async actionNotValid() {
    const modal = await this.modalCtrl.create({
      component: ModalActionNotValidComponent,
      cssClass: 'bg-transp'
    });
    await modal.present();
  }

}

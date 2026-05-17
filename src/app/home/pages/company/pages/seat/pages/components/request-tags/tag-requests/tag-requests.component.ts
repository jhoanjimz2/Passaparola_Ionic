import { Component, Input, OnInit, OnDestroy }                 from '@angular/core';
import { IonContent, IonIcon }                                 from '@ionic/angular/standalone';
import { HeaderModalComponent }                                from '../../followers/header-modal/header-modal.component';
import { ModalController, NavController }                      from '@ionic/angular';
import { CommonModule }                                        from '@angular/common';
import { TagRequestComponent }                                 from '../tag-request/tag-request.component';
import { RequestTagsService, TagRequestsState }                from '../../../../../../../../../shared/services/request-tags.service';
import { Subject, takeUntil }                                  from 'rxjs';
import { TagRequestActionsComponent }                          from '../tag-request-actions/tag-request-actions.component';

@Component({
  selector: 'app-tag-requests',
  templateUrl: './tag-requests.component.html',
  styleUrls: ['./tag-requests.component.scss'],
  standalone: true,
  imports: [
    HeaderModalComponent,
    IonContent,
    IonIcon,
    CommonModule,
    TagRequestComponent
  ]
})
export class TagRequestsComponent implements OnInit, OnDestroy {
  @Input() id: string = '';

  activeFilter: string = 'tutti';

  filters = [
    { key: 'pendenti', label: 'Pendenti' },
    { key: 'tutti', label: 'Tutti' },
    { key: 'accettati', label: 'Accettati' },
    { key: 'rifiutati', label: 'Rifiutati' }
  ];

  pendingState: TagRequestsState = {
    data: [],
    metadata: { page: 1, total: 0, lastPage: 1 },
    loading: false,
    loaded: false
  };

  acceptedState: TagRequestsState = {
    data: [],
    metadata: { page: 1, total: 0, lastPage: 1 },
    loading: false,
    loaded: false
  };

  rejectedState: TagRequestsState = {
    data: [],
    metadata: { page: 1, total: 0, lastPage: 1 },
    loading: false,
    loaded: false
  };

  allState: TagRequestsState = {
    data: [],
    metadata: { page: 1, total: 0, lastPage: 1 },
    loading: false,
    loaded: false
  };

  private destroy$ = new Subject<void>();

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private requestTagsService: RequestTagsService
  ) {}

  ngOnInit() {
    this.requestTagsService.pendingState
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.pendingState = state;
        this.updateAllState();
      });

    this.requestTagsService.acceptedState
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.acceptedState = state;
        this.updateAllState();
      });

    this.requestTagsService.rejectedState
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.rejectedState = state;
        this.updateAllState();
      });

    this.loadInitialData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateAllState() {
    this.allState = this.requestTagsService.getCombinedState();
  }

  private loadInitialData() {
    this.requestTagsService.loadPendingTagRequests(this.id).subscribe({
      error: (err) => console.error('Error cargando pendientes:', err)
    });

    this.requestTagsService.loadAcceptedTagRequests(this.id).subscribe({
      error: (err) => console.error('Error cargando aceptados:', err)
    });

    this.requestTagsService.loadRejectedTagRequests(this.id).subscribe({
      error: (err) => console.error('Error cargando rechazados:', err)
    });
  }

  get currentState(): TagRequestsState {
    switch (this.activeFilter) {
      case 'pendenti':
        return this.pendingState;
      case 'accettati':
        return this.acceptedState;
      case 'rifiutati':
        return this.rejectedState;
      case 'tutti':
      default:
        return this.allState;
    }
  }

  get currentData() {
    return this.currentState.data;
  }

  get isLoading() {
    return this.currentState.loading;
  }

  get hasData() {
    return this.currentData.length > 0;
  }

  get canLoadMore() {
    const state = this.currentState;
    return state.metadata.page < state.metadata.lastPage;
  }

  close() {
    this.modalCtrl.dismiss();
  }

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
  }

  loadMore(event?: any) {
    let loadObservable = null;

    switch (this.activeFilter) {
      case 'pendenti':
        loadObservable = this.requestTagsService.loadMorePending(this.id);
        break;
      case 'accettati':
        loadObservable = this.requestTagsService.loadMoreAccepted(this.id);
        break;
      case 'rifiutati':
        loadObservable = this.requestTagsService.loadMoreRejected(this.id);
        break;
    }

    if (loadObservable) {
      loadObservable.subscribe({
        next: () => {
          if (event) event.target.complete();
        },
        error: (err) => {
          console.error('Error cargando más datos:', err);
          if (event) event.target.complete();
        }
      });
    } else {
      if (event) event.target.complete();
    }
  }

  refresh(event?: any) {
    switch (this.activeFilter) {
      case 'pendenti':
        this.requestTagsService.refreshPending(this.id).subscribe({
          next: () => {
            if (event) event.target.complete();
          },
          error: () => {
            if (event) event.target.complete();
          }
        });
        break;
      case 'accettati':
        this.requestTagsService.refreshAccepted(this.id).subscribe({
          next: () => {
            if (event) event.target.complete();
          },
          error: () => {
            if (event) event.target.complete();
          }
        });
        break;
      case 'rifiutati':
        this.requestTagsService.refreshRejected(this.id).subscribe({
          next: () => {
            if (event) event.target.complete();
          },
          error: () => {
            if (event) event.target.complete();
          }
        });
        break;
      case 'tutti':
        this.loadInitialData();
        if (event) {
          setTimeout(() => event.target.complete(), 1000);
        }
        break;
    }
  }

  actions(type: 'reject' | 'accept' | 'delete' | 'view', request: any) {
    switch (type) {
      case 'reject':
        this.reject(request);
        break;
      case 'accept':
        this.accept(request);
        break;
      case 'delete':
        this.openTagRequestActions(request);
        break;
      case 'view':
        this.modalCtrl.dismiss();
        this.navCtrl.navigateForward(['/pages/company/seat/view-post', request.socialCommunity.id]);
        break;
    }
  }

  async openTagRequestActions(request: any) {
    const modal = await this.modalCtrl.create({
      component: TagRequestActionsComponent,
      componentProps: { request },
      cssClass: ['radius-modals', 'modal-60vh'],
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.reject(request);
    }
  }

  accept(request: any) {
    this.requestTagsService.accept(request.id, this.id).subscribe();
  }

  reject(request: any) {
    this.requestTagsService.reject(request.id, this.id).subscribe();
  }
}

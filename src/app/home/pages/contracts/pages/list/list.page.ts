import { Component, OnInit }                                       from '@angular/core';
import { RouterLink }                                              from '@angular/router';
import { IonContent, IonSpinner, IonInfiniteScroll,
         IonInfiniteScrollContent, IonRefresher,
         IonRefresherContent,
         InfiniteScrollCustomEvent, RefresherCustomEvent }        from '@ionic/angular/standalone';
import { CommonModule }                                            from '@angular/common';
import { ComponentModule }                                         from 'src/app/components/component.module';
import { Contract, ContractStatus }                                from 'src/app/shared/interfaces/contract/contract.interface';
import { ContractService }                                         from 'src/app/shared/services/contract.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonRefresher,
    IonRefresherContent,
    CommonModule,
    ComponentModule,
    RouterLink,
  ]
})
export class ListPage implements OnInit {

  contracts: Contract[] = [];
  isLoading = false;
  hasError  = false;

  private page  = 1;
  private limit = 10;
  lastPage      = 1;

  readonly flowSteps: { key: ContractStatus; label: string }[] = [
    { key: 'pending',  label: 'In attesa' },
    { key: 'signed',   label: 'Firmato'   },
    { key: 'approved', label: 'Approvato' },
  ];

  private readonly stepOrder: ContractStatus[] = ['pending', 'signed', 'approved'];

  constructor(private contractService: ContractService) {}

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(): void {
    this.isLoading = true;
    this.hasError  = false;
    this.page      = 1;

    this.contractService.getAll({ limit: this.limit, offset: this.page, languageCode: 'IT' })
      .subscribe({
        next: (res) => {
          this.contracts = res.data;
          this.lastPage  = res.metadata.lastPage;
          this.isLoading = false;
        },
        error: () => {
          this.hasError  = true;
          this.isLoading = false;
        }
      });
  }

  handleRefresh(event: RefresherCustomEvent): void {
    this.page = 1;

    this.contractService.getAll({ limit: this.limit, offset: this.page, languageCode: 'IT' })
      .subscribe({
        next: (res) => {
          this.contracts = res.data;
          this.lastPage  = res.metadata.lastPage;
          this.hasError  = false;
          event.target.complete();
        },
        error: () => {
          this.hasError = true;
          event.target.complete();
        }
      });
  }

  loadMore(event: InfiniteScrollCustomEvent): void {
    if (this.page >= this.lastPage) {
      event.target.complete();
      event.target.disabled = true;
      return;
    }

    this.page++;
    this.contractService.getAll({ limit: this.limit, offset: this.page, languageCode: 'IT' })
      .subscribe({
        next: (res) => {
          this.contracts.push(...res.data);
          this.lastPage = res.metadata.lastPage;
          event.target.complete();
          if (this.page >= this.lastPage) event.target.disabled = true;
        },
        error: () => event.target.complete()
      });
  }

  statusLabel(status: ContractStatus): string {
    const labels: Record<ContractStatus, string> = {
      pending:  'In attesa',
      signed:   'Firmato',
      approved: 'Approvato',
      rejected: 'Rifiutato',
    };
    return labels[status] ?? status;
  }

  isStepDone(currentStatus: ContractStatus, stepKey: ContractStatus): boolean {
    if (currentStatus === 'rejected') return stepKey === 'pending';
    const currentIdx = this.stepOrder.indexOf(currentStatus);
    const stepIdx    = this.stepOrder.indexOf(stepKey);
    return stepIdx <= currentIdx;
  }

  isStepCurrent(currentStatus: ContractStatus, stepKey: ContractStatus): boolean {
    if (currentStatus === 'rejected') return false;
    return currentStatus === stepKey;
  }

  trackById(_: number, item: Contract): string {
    return item.id;
  }
}

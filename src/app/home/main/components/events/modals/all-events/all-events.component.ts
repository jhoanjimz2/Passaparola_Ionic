import { Component, Input, OnDestroy, OnInit }  from '@angular/core';
import { Subscription }                         from 'rxjs';
import { CategoryEvent, Events }                from 'src/app/shared/interfaces/events/events';
import { EventsService }                        from 'src/app/shared/services';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.scss']
})
export class AllEventsComponent implements OnDestroy, OnInit {
  @Input() categorySelect: CategoryEvent = {} as CategoryEvent;

  allCategories: CategoryEvent[] = [];
  selectCategories: string[] = [];
  keyword: string = '';

  allEvents: Events[] = [];
  allEventsFilter: Events[] = [];

  private subscription!: Subscription;
  private subscription2!: Subscription;
  private subscription3!: Subscription;

  constructor( private eventsService: EventsService ) {
    this.subscription = this.eventsService.obtenerAllEvents().subscribe({
      next: (events) => { this.allEvents = events; }
    });
    this.subscription2 = this.eventsService.obtenerAllEventsFilter().subscribe({
      next: (events) => { this.allEventsFilter = events; }
    });
    this.subscription3 = this.eventsService.obtenerAllCategorys().subscribe({
      next: (event) => {
        let categories = this.flattenCategories(structuredClone(event))
        this.allCategories = categories;
      }
    });
  }
  ngOnInit() {
    if (this.categorySelect?.id) {
      this.selectCategories = [this.categorySelect.id]
      this.eventsAllForCategories()
    }
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
    if (this.subscription3) this.subscription3.unsubscribe();
  }
  searchForCategories(categories: any) {
    this.selectCategories = categories.selectedCategories;
    this.eventsAllForCategories();
  }
  eventsAllForCategories() {
    this.eventsService.getAllEventsFilter(
      {filter: this.selectCategories, keyword: ''}
    ).subscribe();
  }

  handleRefresh(event: any) {
    this.eventsService.getAllEvents({keyword: ''}).subscribe();
    this.eventsService.getAllEventsFilter({filter: this.selectCategories, keyword: ''}).subscribe();
    setTimeout(() => event.target.complete(), 100);
  }
  flattenCategories(categories: any[], seen = new Set()): any[] {
    let result: any[] = [];
    categories.forEach(category => {
      if (seen.has(category.id)) return;
      seen.add(category.id);
      result.push({ ...category, children: undefined });
      if (category.children && category.children.length > 0) {
        result = result.concat(this.flattenCategories(category.children, seen));
      }
    });
    return result;
  }


}

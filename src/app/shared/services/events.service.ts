import { Injectable }        from '@angular/core';
import {
  map,
  catchError,
  throwError,
  Observable,
  switchMap,
  BehaviorSubject,
  tap,
  forkJoin,
  of,
} from 'rxjs';
import { environment }       from 'src/environments/environment';
import { API_TOKEN }         from 'src/app/core/interceptors/http.interceptor.service';
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import {
  BuyTicket,
  CategoryEvent,
  Events,
  EventStats,
  EventTag,
  Product,
  Rule,
  ScheduleEvent,
  SeatLocation,
  StateEvent,
  Ticket,
} from '../interfaces/events/events';
import { Wallet }            from '../interfaces/wallet/wallet.interface';
import { User }              from '../interfaces/user/user.interface';
import { IResponseBankCard } from '../interfaces/bank-card/bank-card.interface';
import { PaymentMethod }     from '../interfaces/stripe/payment-method.interface';
import { MainWallets }       from '../interfaces/wallet/main-wallets.interface';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private user: User = {} as User;

  private allTags$ = new BehaviorSubject<string[]>([]);
  private allState$ = new BehaviorSubject<StateEvent[]>([]);
  private allCategory$ = new BehaviorSubject<CategoryEvent[]>([]);
  private allCategoryFlatten$ = new BehaviorSubject<CategoryEvent[]>([]);

  private allCardPayment$ = new BehaviorSubject<PaymentMethod[]>([]);

  private allEventsFilter$ = new BehaviorSubject<Events[]>([]);

  private allEvents$ = new BehaviorSubject<Events[]>([]);
  private myEvents$ = new BehaviorSubject<Events[]>([]);
  private myEventsTickets$ = new BehaviorSubject<Events[]>([]);

  private eventSelected$ = new BehaviorSubject<Events>({} as Events);
  private walletSelected$ = new BehaviorSubject<Wallet>({} as Wallet);

  private eventStats$ = new BehaviorSubject<EventStats>({} as EventStats);

  private mainWallets$ = new BehaviorSubject<MainWallets>({} as MainWallets);

  constructor(private http: HttpClient) {}

  //LOAD DATA
  dataGeneralEvents() {
    this.user = JSON.parse(localStorage.getItem('appPassaparola_user')!);
    forkJoin([
      this.getAllCategory(),
      this.findWalletsByUserId(),
      this.findMainWallets(),
      this.user.rol === 'company' ? this.getAllTags() : of([]),
      this.user.rol === 'company' ? this.getAllState() : of([]),
    ]).subscribe();
    this.getCardsAndPaymentMethods();
  }
  dataInitEvents() {
    this.user = JSON.parse(localStorage.getItem('appPassaparola_user')!);
    forkJoin([
      this.getAllEvents({}),
      this.user.rol === 'company'
        ? this.getMyEventsCreateFilters({ filter: 'all' })
        : of([]),
      this.getMyEventsTicket(),
    ]).subscribe();
  }
  updateDataMyEvents() {
    forkJoin([this.getMyEventsCreateFilters({ filter: 'all' })]).subscribe();
  }

  //RELOAD DATA
  reloadDataEvents(filter: string) {
    this.user = JSON.parse(localStorage.getItem('appPassaparola_user')!);
    forkJoin([
      this.getAllEvents({}),
      this.getMyEventsTicket(),
      this.user.rol == 'company'
        ? this.getMyEventsCreateFilters({ filter })
        : of([]),
    ]).subscribe();
  }

  //VARIABLES RXJS

  //SET VARS EVENTS
  setEventoCompleto(nuevoEvento: Events) {
    this.eventSelected$.next(nuevoEvento);
  }
  actualizarEvento(parcial: Partial<Events>) {
    const estadoActual = this.eventSelected$.value;
    this.eventSelected$.next({ ...estadoActual, ...parcial });
  }

  //GET ALL & FILTER EVENTS
  obtenerAllEventsFilter(): Observable<Events[]> {
    return this.allEventsFilter$.asObservable();
  }
  obtenerAllEvents(): Observable<Events[]> {
    return this.allEvents$.asObservable();
  }
  obtenerMyEvents(): Observable<Events[]> {
    return this.myEvents$.asObservable();
  }
  obtenerMyEventsTickets(): Observable<Events[]> {
    return this.myEventsTickets$.asObservable();
  }
  obtenerEventStats(): Observable<EventStats> {
    return this.eventStats$.asObservable();
  }

  // GET SELECTES
  obtenerWalletSelect(): Observable<Wallet> {
    return this.walletSelected$.asObservable();
  }
  obtenerEventSelect(): Observable<Events> {
    return this.eventSelected$.asObservable();
  }

  //GET OBJECTS ALL
  obtenerAllCardPayments(): Observable<PaymentMethod[]> {
    return this.allCardPayment$.asObservable();
  }
  obtenerAllTags(): Observable<string[]> {
    return this.allTags$.asObservable();
  }
  obtenerAllCategorys(): Observable<CategoryEvent[]> {
    return this.allCategory$.asObservable();
  }
  obtenerAllCategoryFlatten(): Observable<CategoryEvent[]> {
    return this.allCategoryFlatten$.asObservable();
  }
  obtenerAllState(): Observable<StateEvent[]> {
    return this.allState$.asObservable();
  }

  //GET DATA PAY
  obtenerMainWallets(): Observable<MainWallets> {
    return this.mainWallets$.asObservable();
  }

  //EVENTS
  getAllEventsFilter({
    filter,
    keyword,
    offset = 0,
    limit = 10,
  }: {
    filter: string[];
    keyword?: string;
    offset?: number;
    limit?: number;
  }): Observable<Events[]> {
    let httpParams = new HttpParams()
      .set('offset', offset)
      .set('keyword', keyword || '')
      .set('limit', limit)
      .set('languageCode', 'IT');
    return this.http
      .post<Events[]>(
        `${environment.apiKrathemis}/event/find-all/active`,
        filter,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
          params: httpParams,
        }
      )
      .pipe(
        tap((events: Events[]) => this.allEventsFilter$.next(events)),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }
  getMyEventsCreateFilters({
    filter,
    keyword = '',
    offset = 0,
    limit = 10,
  }: {
    filter: string;
    languageCode?: string;
    keyword?: string;
    offset?: number;
    limit?: number;
  }): Observable<Events[]> {
    let httpParams = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString())
      .set('keyword', keyword.toString())
      .set('languageCode', 'IT');
    return this.http
      .get<Events[]>(
        `${environment.apiKrathemis}/event/find-all/by-user/${filter}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
          params: httpParams,
        }
      )
      .pipe(
        tap((events: Events[]) => this.myEvents$.next(events)),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }
  getAllEvents({
    keyword = '',
    offset = 0,
    limit = 1000000,
  }: {
    keyword?: string;
    offset?: number;
    limit?: number;
  }): Observable<Events[]> {
    let httpParams = new HttpParams()
      .set('offset', offset)
      .set('keyword', keyword)
      .set('limit', limit)
      .set('languageCode', 'IT');
    return this.http
      .post<Events[]>(`${environment.apiKrathemis}/event/find-all/active`, [], {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        params: httpParams,
      })
      .pipe(
        tap((events: Events[]) => this.allEvents$.next(events)),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }
  getEventToId(id: string): Observable<Events> {
    return this.http
      .get<Events>(`${environment.apiKrathemis}/event/${id}`, {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      })
      .pipe(
        switchMap((event: Events) =>
          forkJoin({ rules: this.getRulesToIdEvent(id) }).pipe(
            map(({ rules }) => {
              event.rules = rules;
              return event;
            })
          )
        ),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }
  getMyEventsTicket(): Observable<Events[]> {
    return this.http
      .get<Events[]>(
        `${environment.apiKrathemis}/event/events-and-tickets/by-user`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        tap((events: Events[]) => this.myEventsTickets$.next(events)),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }
  getEventStats(id: string): Observable<EventStats> {
    return this.http
      .get<EventStats>(`${environment.apiKrathemis}/event/summary/${id}`, {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      })
      .pipe(
        tap((events: EventStats) => this.eventStats$.next(events)),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }

  //SEAT
  seatCover(id: string, coverUrlFile: string) {
    // return this.http.patch<any>(`${environment.apiKrathemis}/event/${id}/IT}`, { coverUrlFile },
    return this.http
      .patch<any>(
        `${environment.apiKrathemis}/event/${id}/IT}`,
        { coverUrlFile },
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        tap(() => this.updateDataMyEvents()),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }
  seatProfile(id: string, pictureUlrFile: string) {
    return this.http
      .patch<any>(
        `${environment.apiKrathemis}/event/${id}/IT}`,
        { pictureUlrFile },
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        tap(() => this.updateDataMyEvents()),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }
  seatCategories(id: string, categories: CategoryEvent[]) {
    return this.http
      .patch<any>(
        `${environment.apiKrathemis}/event/${id}/IT}`,
        { categories },
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(map((response: any) => response))
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }
  seatName(id: string, name: string) {
    return this.http
      .patch<any>(
        `${environment.apiKrathemis}/event/${id}/IT}`,
        { name },
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        tap(() => this.updateDataMyEvents()),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }
  seatSchedule(
    id: string,
    schedule: ScheduleEvent[],
    dateFrom: Date,
    dateTo: Date
  ) {
    return this.http
      .patch<any>(
        `${environment.apiKrathemis}/event/${id}/IT}`,
        { schedule, dateFrom, dateTo },
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        tap(() => this.updateDataMyEvents()),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }
  seatLocation(id: string, location: SeatLocation) {
    return this.http
      .patch<any>(
        `${environment.apiKrathemis}/event/${id}/IT`,
        { ...location },
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        tap(() => this.updateDataMyEvents()),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }
  seatDescription(id: string, description: string) {
    return this.http
      .patch<any>(
        `${environment.apiKrathemis}/event/${id}/IT}`,
        { description },
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        tap(() => this.updateDataMyEvents()),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }
  seatTags(id: string, tags: string[]) {
    return this.http
      .patch<any>(
        `${environment.apiKrathemis}/event/${id}/IT}`,
        { tags },
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(map((response: any) => response))
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }
  seatGallery(id: string, pictureGallery: string[]) {
    return this.http
      .patch<any>(
        `${environment.apiKrathemis}/event/${id}/IT}`,
        { pictureGallery },
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        tap(() => this.updateDataMyEvents()),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }
  seatGreen(id: string, greenDescription: string, isGreen: boolean) {
    return this.http
      .patch<any>(
        `${environment.apiKrathemis}/event/${id}/IT}`,
        { isGreen, greenDescription },
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        tap(() => this.updateDataMyEvents()),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }

  //RULES
  getRulesToIdEvent(id: string) {
    return this.http
      .get<Rule[]>(
        `${environment.apiKrathemis}/event/find/rule-by-event/${id}`,
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        map((response: Rule[]) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  deletRuleEventToId(id: string) {
    return this.http
      .delete<Rule>(`${environment.apiKrathemis}/event/delete/rule/${id}`, {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      })
      .pipe(
        map((response: Rule) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  createRuleEvent(rule: Rule[]) {
    return this.http
      .post<Rule[]>(
        `${environment.apiKrathemis}/event/create-update/rule`,
        rule,
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        map((response: Rule[]) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  //PRODUCTS
  getProductToIdEvent(id: string) {
    return this.http
      .get<Product[]>(
        `${environment.apiKrathemis}/event/find/product-by-event/${id}`,
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        map((response: Product[]) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  getProductToIdEventToProfile(id: string) {
    return this.http
      .get<Product[]>(
        `${environment.apiKrathemis}/event/find/product-by-event/${id}`,
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        map((response: Product[]) => {
          this.actualizarEvento({ products: response });
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  deletProductEventToId(id: string) {
    return this.http
      .delete<Product>(
        `${environment.apiKrathemis}/event/delete/product/${id}`,
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        map((response: Product) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  createProductEvent(product: Product) {
    return this.http
      .post<Product[]>(
        `${environment.apiKrathemis}/event/create-update/product`,
        [product],
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        map((response: Product[]) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  createProductImgEvent(pictureUlrFile: string, event: { id: string }) {
    return this.http
      .post<Product[]>(
        `${environment.apiKrathemis}/event/create-update/product`,
        [{ pictureUlrFile, event }],
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        map((response: Product[]) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  updateProductImgEvent(
    pictureUlrFile: string,
    id: string,
    event: { id: string }
  ) {
    return this.http
      .post<Product>(
        `${environment.apiKrathemis}/event/create-update/product`,
        [{ pictureUlrFile, id, event }],
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        map((response: Product) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  //TICKETS
  getTicketsToIdEvent(id: string) {
    return this.http
      .get<Ticket[]>(
        `${environment.apiKrathemis}/event/find/ticket-by-event/${id}`,
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        map((response: Ticket[]) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  deletTicketEventToId(id: string) {
    return this.http
      .delete<Ticket>(`${environment.apiKrathemis}/event/delete/ticket/${id}`, {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      })
      .pipe(
        map((response: Ticket) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  getTicketsToIdEventToProfile(id: string) {
    return this.http
      .get<Ticket[]>(
        `${environment.apiKrathemis}/event/find/ticket-by-event/${id}`,
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        map((response: Ticket[]) => {
          this.actualizarEvento({ tickets: response });
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  createTicketEvent(ticket: Ticket) {
    return this.http
      .post<Ticket[]>(
        `${environment.apiKrathemis}/event/create-update/ticket`,
        [ticket],
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        map((response: Ticket[]) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  createEvent() {
    return this.http
      .post<any>(
        `${environment.apiKrathemis}/event`,
        {},
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        switchMap((response: any) => this.getEventToId(response.id)),
        tap(() => this.updateDataMyEvents()),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }

  //PUBLIC EVENT
  publicEvent(id: string) {
    return this.http
      .patch<any>(
        `${environment.apiKrathemis}/event/status/public/${id}`,
        {},
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        tap(() => this.updateDataMyEvents()),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }

  getAllState() {
    let httpParams = new HttpParams()
      .set('offset', 0)
      .set('keyword', '')
      .set('limit', 1000)
      .set('languageCode', 'IT');
    return this.http
      .get<StateEvent[]>(
        `${environment.apiKrathemis}/event/find-all/event-status`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
          params: httpParams,
        }
      )
      .pipe(
        map((response: StateEvent[]) => {
          this.allState$.next(response);
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  getAllCategory() {
    let httpParams = new HttpParams()
      .set('offset', 0)
      .set('keyword', '')
      .set('limit', 1000)
      .set('languageCode', 'IT');
    return this.http
      .get<CategoryEvent[]>(
        `${environment.apiKrathemis}/event/categories/find-all/with-children`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
          params: httpParams,
        }
      )
      .pipe(
        map((response: CategoryEvent[]) => {
          const categories = response.map((category: any) =>
            this.transformCategory(category)
          );
          this.allCategory$.next(categories);
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  private transformCategory(category: any) {
    category.eventCategoryTranslation = category.eventCategoryTranslation[0];
    if (category.children && category.children.length > 0) {
      category.children = category.children.map((child: any) =>
        this.transformCategory(child)
      );
    }
    return category;
  }
  getAllCategoryFlatten() {
    let httpParams = new HttpParams()
      .set('offset', 0)
      .set('keyword', '')
      .set('limit', 1000)
      .set('languageCode', 'IT');

    return this.http
      .get<CategoryEvent[]>(
        `${environment.apiKrathemis}/event/categories/find-all/with-children`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
          params: httpParams,
        }
      )
      .pipe(
        map((response: CategoryEvent[]) => {
          // Aplanamos las categorías
          const categories = this.flattenCategories(response);
          this.allCategoryFlatten$.next(categories);
          return categories;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  private flattenCategories(categories: any[]): any[] {
    let result: any[] = [];
    for (const category of categories) {
      category.eventCategoryTranslation = category.eventCategoryTranslation[0];

      if (category.children && category.children.length > 0) {
        result = result.concat(this.flattenCategories(category.children));
      } else {
        result.push(category);
      }
    }
    return result;
  }

  getAllTags() {
    let httpParams = new HttpParams()
      .set('offset', 0)
      .set('limit', 100000000)
      .set('languageCode', 'IT');
    return this.http
      .get<EventTag[]>(`${environment.apiKrathemis}/event/tags/find-all`, {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        params: httpParams,
      })
      .pipe(
        map((response: EventTag[]) => {
          const sortedTags = response.map((t: any) => t.description).sort();
          this.allTags$.next(sortedTags);
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  findWalletsByUserId() {
    return this.http
      .get<Wallet[]>(
        `${environment.apiUnika}/wallet/find-wallets-by-user-id/${this.user
          .userID!}`,
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        map((response: Wallet[]) => {
          const wallets = response.filter(
            (wallet) => !wallet.isInvestment && !wallet.isNik
          );
          const defaultWallet = wallets.find((wallet) => wallet.default);
          this.walletSelected$.next(defaultWallet ?? wallets[0]);
        })
      )
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }


  //PAGOS TICKETS EVENTS
  getCardsAndPaymentMethods(): void {
    this.getCardsUser()
      .pipe(
        switchMap((response: IResponseBankCard) => {
          const customerIds: string[] = response.data.map(
            (card) => card.idStripe
          );
          return this.getPaymentMethods(customerIds);
        })
      )
      .subscribe({
        next: (response) => this.allCardPayment$.next(response),
      });
  }

  getCardsUser(): Observable<IResponseBankCard> {
    let httpParams = new HttpParams().set('offset', 1).set('limit', 1000);
    return this.http
      .get<IResponseBankCard>(
        `${environment.apiKrathemis}/bank-card/find-all/true`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
          params: httpParams,
        }
      )
      .pipe(
        map((response: IResponseBankCard) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  getPaymentMethods(customerIds: string[]) {
    return this.http
      .post<PaymentMethod[]>(
        `${environment.apiUnika}/stripe/payment-methods`,
        customerIds,
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  payForWallet(buyTicket: BuyTicket) {
    return this.http
      .post<PaymentMethod[]>(
        `${environment.apiKrathemis}/event/buy-ticket`,
        { ...buyTicket },
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        map((response) => {
          return response;
        }),
        tap(() => this.getAllEvents({ keyword: '' }).subscribe()),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  //DATA PAY
  findMainWallets() {
    return this.http
      .get<MainWallets>(`${environment.apiUnika}/wallet/find/main-wallets`, {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      })
      .pipe(tap((wallets: MainWallets) => this.mainWallets$.next(wallets)))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  //Check Ticket
  getCheckTicket(id: string): Observable<any> {
    return this.http
      .get<any>(`${environment.apiKrathemis}/event/check/ticket/${id}`, {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      })
      .pipe(
        map((response: any) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
}

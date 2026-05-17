import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, throwError } from 'rxjs';

import { API_TOKEN } from 'src/app/core/interceptors/http.interceptor.service';
import { environment } from 'src/environments/environment';
import { CreateCustomer } from '../interfaces/stripe/requets/create-customer.interface';
import { CreatePaymentIntent } from '../interfaces/stripe/requets/create-payment-intent.interface';
import { PaymentCustomerResponse } from '../interfaces/stripe/response/payment-customer-response';
import { PaymentIntentResponse } from '../interfaces/stripe/response/payment-intent-response';
import { PaymentMethod } from '../interfaces/stripe/payment-method.interface';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  constructor(private http: HttpClient) {}

  createCustomer(createCustomer: CreateCustomer) {
    return this.http
      .post<PaymentCustomerResponse>(
        `${environment.apiUnika}/stripe/create-customer`,
        createCustomer,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
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

  createPaymentIntent(createPaymentIntent: CreatePaymentIntent) {
    return this.http
      .post<PaymentIntentResponse>(
        `${environment.apiUnika}/stripe/create-payment-intent`,
        createPaymentIntent,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
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

  getPaymentMethod(customerId: string) {
    return this.http
      .get<PaymentMethod>(
        `${environment.apiUnika}/stripe/payment-method/${customerId}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
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

  getPaymentMethods(customerIds: string[]) {
    return this.http
      .post<PaymentMethod[]>(
        `${environment.apiUnika}/stripe/payment-methods`,
        customerIds,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
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
}

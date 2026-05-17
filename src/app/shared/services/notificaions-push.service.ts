import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable }                              from '@angular/core';
import { PushNotifications }                       from '@capacitor/push-notifications';

import { catchError, map, Observable, throwError } from 'rxjs';

import { API_TOKEN }                               from 'src/app/core/interceptors/http.interceptor.service';
import { environment }                             from 'src/environments/environment';
import { User }                                    from '../interfaces/user/user.interface';
import { Company }                                 from '../interfaces/company/company.interface';
import { NavController }                           from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class NotificationsPushService {
  user: User | Company | undefined;

  constructor(private http: HttpClient, private navController: NavController) {
    const user = localStorage.getItem('appPassaparola_user');
    this.user = user ? JSON.parse(user) : undefined;
  }

  async registerNotifications() {
    try {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      }

      await PushNotifications.register();

      this.addListeners();
    } catch (error) {
      console.error(error);
    }
  }

  async addListeners() {
    await PushNotifications.addListener('registration', (token) => {
      console.info('Push Notifications Registration token: ', token.value);

      if (token.value && this.user?.userID)
        this.registerToken(token.value).subscribe();
    });

    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.info('Push notification received: ', notification);
      }
    );

    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification) => {
        console.info(
          'Push notification action performed',
          notification.notification.data
        );
        const data = notification.notification.data;
        this.handleNotificationAction(data);
      }
    );
  }

  async getDeliveredNotifications() {
    const notificationList =
      await PushNotifications.getDeliveredNotifications();
    console.info('delivered notifications', notificationList);
  }

  registerToken(token: string): Observable<any> {
    const requets = {
      token: token,
      userId: this.user!.userID,
    };

    return this.http
      .post<any>(
        `${environment.apiKrathemis}/push-notification/register-update-token`,
        requets,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response: any) => {
          console.info('registerToken', response);
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  private handleNotificationAction(data: any) {
    if (data && data.route) {
      this.navController.navigateRoot([data.route]);
    }
  }
}

import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable }                  from '@angular/core';

import { catchError, map, throwError } from 'rxjs';

import { environment }                 from 'src/environments/environment';
import { API_TOKEN }                   from 'src/app/core/interceptors/http.interceptor.service';
import { SmsSendCodeResponse }         from '../interfaces/sms-code/response/sms-send-code-response.interface';
import { EmailSendCodeResponse }       from '../interfaces/email-code/response/email-send-code-response.interface';
import { EmailSendCodeRequest }        from '../interfaces/email-code/request/email-send-code-request.interface';

@Injectable({
  providedIn: 'root',
})
export class EmailCodeService {
  constructor(private http: HttpClient) {}

  sendEmail(emailSendCodeRequest: EmailSendCodeRequest) {
    return this.http
      .post<EmailSendCodeResponse>(
        `${environment.apiKrathemis}/email-code`,
        emailSendCodeRequest,
        {
          context: new HttpContext().set(API_TOKEN, { krathemisBasic: true }),
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
  sendEmailToProfessional(
    professionalEmail: string,
    professionalName: string,
    subject: string,
    title: string,
    description: string,
    userName: string = 'Usuario'
  ) {
    const htmlContent = this.buildEmailTemplate(title, description, userName);

    const emailRequest: EmailSendCodeRequest = {
      to: [
        {
          email: professionalEmail,
          name: professionalName
        }
      ],
      subject: subject,
      htmlContent: htmlContent
    };

    return this.http
      .post<EmailSendCodeResponse>(
        `${environment.apiKrathemis}/email-code`,
        emailRequest,
        {
          context: new HttpContext().set(API_TOKEN, { krathemisBasic: true }),
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
  private buildEmailTemplate(title: string, description: string, userName: string): string {
    return `
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nuova Richiesta</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            background-color: #F9B139;
            color: white;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content {
            padding: 30px;
          }
          .info-box {
            background-color: #fff9f0;
            border-left: 4px solid #F9B139;
            padding: 20px;
            margin: 20px 0;
          }
          .info-box h2 {
            margin-top: 0;
            color: #F9B139;
            font-size: 20px;
            font-weight: 600;
          }
          .description {
            background-color: #fafafa;
            padding: 20px;
            border-radius: 4px;
            margin: 15px 0;
            border: 1px solid #e0e0e0;
          }
          .footer {
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .label {
            font-weight: 600;
            color: #555;
            margin-bottom: 8px;
            font-size: 14px;
          }
          .from-user {
            margin: 20px 0;
            color: #666;
            font-size: 15px;
          }
          .from-user strong {
            color: #333;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nuova Richiesta Ricevuta</h1>
          </div>

          <div class="content">
            <p class="from-user">Hai ricevuto una nuova richiesta da <strong>${userName}</strong></p>

            <div class="info-box">
              <h2>${title}</h2>
            </div>

            <div class="label">Descrizione della richiesta:</div>
            <div class="description">
              <p style="margin: 0;">${description.replace(/\n/g, '<br>')}</p>
            </div>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              Ti preghiamo di rispondere a questa richiesta il prima possibile.
            </p>
          </div>

          <div class="footer">
            <p>Questo è un messaggio automatico, si prega di non rispondere direttamente a questa email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  checkCode(code: string, idResponse: string) {
    return this.http
      .get<SmsSendCodeResponse>(
        `${environment.apiKrathemis}/email-code/check/${code}/${idResponse}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemisBasic: true }),
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

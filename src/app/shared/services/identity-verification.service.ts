import { Injectable }                                              from '@angular/core';
import { HttpClient, HttpContext }                                 from '@angular/common/http';
import { Observable }                                              from 'rxjs';

import { API_TOKEN }                                               from 'src/app/core/interceptors/http.interceptor.service';
import { environment }                                             from 'src/environments/environment';
import { IdentityVerificationResponse, SubmitVerificationPayload } from 'src/app/home/pages/profile/pages/identity-verification/identity-verification.page';


export interface ApprovedVerification {
  id: string;
  userId: string;
  documentType: string;
  status: string;
  frontDocumentUrl: string;
  backDocumentUrl: string;
  selfieUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PendingVerification {
  id: string;
  userId: string;
  documentType: string;
  status: string;
  frontDocumentUrl: string;
  backDocumentUrl: string;
  selfieUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionsResponse {
  approvedVerification: ApprovedVerification | null;
  pendingVerification:  PendingVerification  | null;
  identityVerified: boolean;
  allowedFeatures: string[];
}

@Injectable({ providedIn: 'root' })
export class IdentityVerificationService {

  constructor(private http: HttpClient) {}

  /**
   * GET /api/user/identity-verification/{id}
   * Consulta el registro de verificación por su UUID.
   */
  getById(id: string): Observable<IdentityVerificationResponse> {
    return this.http.get<IdentityVerificationResponse>(
      `${environment.apiKrathemis}/user/identity-verification/${id}`,
      { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
    );
  }

  /**
   * POST /api/user/identity-verification
   * Crea el registro con las URLs de las 3 imágenes ya subidas a storage.
   * El backend guarda y pone status = 'pending'.
   */
  submit(payload: SubmitVerificationPayload): Observable<IdentityVerificationResponse> {
    return this.http.post<IdentityVerificationResponse>(
      `${environment.apiKrathemis}/user/identity-verification`,
      payload,
      { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
    );
  }

  /**
   * GET /api/user/{userId}/permissions
   * Usado por el route guard para saber si el usuario puede acceder
   * a funciones que requieren verificación de identidad.
   */
  getPermissions(userId: string): Observable<PermissionsResponse> {
    return this.http.get<PermissionsResponse>(
      `${environment.apiKrathemis}/user/${userId}/permissions`,
      { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
    );
  }
}

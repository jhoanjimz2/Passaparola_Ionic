import { Injectable } from '@angular/core';

export type UserRole =
  'user' |
  'company_operative' |
  'company_legal' |
  'professional_administrative' |
  'professional_public';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private readonly USER_KEY = 'appPassaparola_user';
  private readonly SEAT_KEY = 'appPassaparola_isLoginSeat';

  constructor() {}

  get sede(): UserRole {
    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData) return 'user';

    const companyOrUser = JSON.parse(userData);
    const seat = !!localStorage.getItem(this.SEAT_KEY);
    const rol = companyOrUser?.rol;

    if (rol === 'professional') {
      return seat ? 'professional_public' : 'professional_administrative';
    }

    if (rol === 'company') {
      return seat ? 'company_operative' : 'company_legal';
    }

    return 'user';
  }

  get isUser(): boolean {
    return this.sede === 'user';
  }
  //Business
  get isCompanyLegal(): boolean {
    return this.sede === 'company_legal';
  }
  get isCompanyOperative(): boolean {
    return this.sede === 'company_operative';
  }
  // Profesionals
  get isProfessionalAdministrative(): boolean {
    return this.sede === 'professional_administrative';
  }

  get isProfessionalOperative(): boolean {
    return this.sede === 'professional_public';
  }
}

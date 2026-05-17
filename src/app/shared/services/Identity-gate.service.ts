import { Injectable }                       from '@angular/core';
import { Router }                           from '@angular/router';
import { firstValueFrom }                   from 'rxjs';
import { IdentityVerificationService }      from './identity-verification.service';



/**
 * IDENTITY GATE SERVICE
 *
 * Utilidad para proteger acciones o modales que requieren
 * verificación de identidad aprobada.
 *
 * Uso básico — verificar antes de abrir un modal:
 *
 *   constructor(private identityGate: IdentityGateService) {}
 *
 *   async openSignContract() {
 *     const verified = await this.identityGate.check();
 *     if (!verified) return;  // redirige automáticamente
 *     // abrir modal...
 *     const modal = await this.modalCtrl.create({ component: SignContractModal });
 *     modal.present();
 *   }
 *
 * Uso con callback — ejecutar lógica solo si está verificado:
 *
 *   await this.identityGate.checkAndRun(async () => {
 *     const modal = await this.modalCtrl.create({ component: SignContractModal });
 *     modal.present();
 *   });
 */
@Injectable({ providedIn: 'root' })
export class IdentityGateService {

  constructor(
    private router:          Router,
    private identityService: IdentityVerificationService
  ) {}

  /**
   * Verifica si el usuario tiene identidad aprobada.
   *
   * @returns true si está verificado, false si no (y redirige automáticamente)
   */
  async check(): Promise<boolean> {
    const userId = this.getUserId();

    if (!userId) {
      this.redirect();
      return false;
    }

    try {
      const permissions = await firstValueFrom(
        this.identityService.getPermissions(userId)
      );

      if (permissions.identityVerified) {
        return true;
      }

      this.redirect();
      return false;

    } catch {
      this.redirect();
      return false;
    }
  }

  /**
   * Ejecuta el callback solo si el usuario está verificado.
   * Si no está verificado, redirige a /identity-verification.
   *
   * @param action Función async a ejecutar si está verificado
   */
  async checkAndRun(action: () => void | Promise<void>): Promise<void> {
    const verified = await this.check();
    if (verified) {
      await action();
    }
  }

  // ============================================
  // HELPERS
  // ============================================

  private getUserId(): string {
    try {
      const raw = localStorage.getItem('appPassaparola_user');
      return raw ? JSON.parse(raw)?.userID ?? '' : '';
    } catch {
      return '';
    }
  }

  private redirect(): void {
    this.router.navigate(['/pages/profile/identity-verification']);
  }
}

import { inject }                           from '@angular/core';
import { CanActivateFn, Router }            from '@angular/router';
import { map, catchError }                  from 'rxjs/operators';
import { of }                               from 'rxjs';
import { IdentityVerificationService }      from '../services/identity-verification.service';


/**
 * ROUTE GUARD — identityVerifiedGuard
 *
 * Protege rutas que requieren verificación de identidad aprobada.
 * Si el usuario no está verificado, redirige a /identity-verification.
 *
 * Uso en el router:
 *
 *   {
 *     path: 'sign-contract',
 *     loadComponent: () => import('./sign-contract/sign-contract.page'),
 *     canActivate: [identityVerifiedGuard]
 *   }
 */
export const identityVerifiedGuard: CanActivateFn = () => {
  const router  = inject(Router);
  const service = inject(IdentityVerificationService);

  const raw    = localStorage.getItem('appPassaparola_user');
  const userId = raw ? JSON.parse(raw)?.userID ?? '' : '';

  if (!userId) {
    router.navigate(['/pages/profile/identity-verification']);
    return of(false);
  }

  return service.getPermissions(userId).pipe(
    map((permissions) => {
      if (permissions.identityVerified) {
        return true;
      }
      router.navigate(['/pages/profile/identity-verification']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/pages/profile/identity-verification']);
      return of(false);
    })
  );
};

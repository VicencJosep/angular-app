import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  Observable,
  catchError,
  switchMap,
  throwError,
  of
} from 'rxjs';
import { AuthService } from './auth.service';

export function jwtInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const authService = inject(AuthService);

  const accessToken = authService.getAccessToken();

  if (accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Intentar refresh solo si hay refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          authService.logout();
          router.navigate(['/login']);
          return throwError(() => error);
        }

        return authService.refreshToken().pipe(
          switchMap((response) => {
            const newAccessToken = response.accessToken;
            authService.setAccessToken(newAccessToken);

            // Reintentar la solicitud original con el nuevo token
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newAccessToken}`
              }
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            console.error('Error al refrescar el token', refreshError);
            authService.logout();
            toastr.error('Su sesión ha expirado.', 'Sesión expirada', {
              timeOut: 3000,
              closeButton: true
            });
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
}

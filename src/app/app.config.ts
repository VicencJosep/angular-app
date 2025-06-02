import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations'; // Importa las animaciones
import { jwtInterceptor } from './services/auth.interceptor'; // Importa tu interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([ jwtInterceptor ])
    ),
    provideAnimations(),
    provideToastr({
      timeOut: 3000, // Duración de la notificación
      positionClass: 'toast-bottom-right', // Posición de la notificación
      preventDuplicates: true, // Evita notificaciones duplicadas
    }),
  ],
};

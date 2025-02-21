import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter,withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ApiCalls } from '../services/apiCalls';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HAMMER_LOADER, HammerModule } from '@angular/platform-browser';



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),     
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      })
    ),
    {
      provide: HAMMER_LOADER,
      useValue: () => import('hammerjs')
    },
    importProvidersFrom(
      HammerModule
    ),
  ]
  
};

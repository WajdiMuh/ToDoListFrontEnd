import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter,withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
// import { CalendarModule, DateAdapter } from 'angular-calendar';
// import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
// import flatpickr from 'flatpickr';
// import  FlatpickrModule  from 'flatpickr';
import { ApiCalls } from '../services/apiCalls';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),     
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes, withHashLocation()), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(),
    
    // importProvidersFrom(
    //   CalendarModule.forRoot({
    //     provide: DateAdapter,
    //     useFactory: adapterFactory,
    //   })
    // ),
  ]
};

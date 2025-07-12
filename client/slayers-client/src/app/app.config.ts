import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTippyConfig, provideTippyLoader, tooltipVariation, popperVariation, TippyProps } from '@ngneat/helipopper/config';
import { routes } from './app.routes';

const darkBorderVariation: Partial<TippyProps> = {};
Object.assign(darkBorderVariation, popperVariation);
darkBorderVariation.theme = "darkBorder";
darkBorderVariation.trigger = "click";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideTippyLoader(() => import('tippy.js')),
    provideTippyConfig({
      defaultVariation: 'darkBorder',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
        darkBorder: darkBorderVariation
      },
      theme: "darkBorder"
    }),
  ]
};

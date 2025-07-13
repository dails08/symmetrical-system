import { provideEventPlugins } from "@taiga-ui/event-plugins";
import { provideAnimations } from "@angular/platform-browser/animations";
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
        provideAnimations(),
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
        provideEventPlugins(),
        provideEventPlugins()
    ]
};

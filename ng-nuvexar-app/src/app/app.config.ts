import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { MockMailProvider } from './core/services/mail/providers/mock-mail.provider';
import { FormspreeMailProvider } from './core/services/mail/providers/formspree-mail.provider';
import { MAIL_PROVIDER } from './core/services/mail/mail-provider.token';
import { EmailjsMailProvider } from './core/services/mail/providers/emailjs-mail.provider';
import { Web3formsMailProvider } from './core/services/mail/providers/web3forms-mail.provider';

function selectMailProvider() {
  switch (environment.mail.provider) {
    case 'formspree': return FormspreeMailProvider;
    case 'emailjs': return EmailjsMailProvider;
    case 'web3forms': return Web3formsMailProvider;
    case 'mock': return MockMailProvider;
    default: return MockMailProvider;
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: MAIL_PROVIDER,
      useClass: selectMailProvider()
    }
  ]
};

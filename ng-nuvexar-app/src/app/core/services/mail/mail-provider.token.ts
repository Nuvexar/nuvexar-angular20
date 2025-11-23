import { InjectionToken } from '@angular/core';
import { MailProvider } from './mail-provider';

export const MAIL_PROVIDER = new InjectionToken<MailProvider>(
  'MAIL_PROVIDER'
);

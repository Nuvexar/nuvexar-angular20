import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
// import { send } from '@emailjs/browser';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';

/**
 * Proveedor para EmailJS.
 * Documentación: https://www.emailjs.com/
 */
@Injectable({
  providedIn: 'root'
})
export class EmailjsMailProvider {

  private serviceId: string;
  private templateId: string;
  private publicKey: string;

  constructor() {
    const serviceId = environment.mail?.emailjs?.serviceId;
    const templateId = environment.mail?.emailjs?.templateId;
    const publicKey = environment.mail?.emailjs?.publicKey;

    if (!serviceId || serviceId === 'REPLACE_ME') {
      throw new Error('[EmailjsMailProviderTs] serviceId no configurado en environment.ts');
    }
    if (!templateId || templateId === 'REPLACE_ME') {
      throw new Error('[EmailjsMailProviderTs] templateId no configurado en environment.ts');
    }
    if (!publicKey || publicKey === 'REPLACE_ME') {
      throw new Error('[EmailjsMailProviderTs] publicKey no configurado en environment.ts');
    }

    this.serviceId = serviceId;
    this.templateId = templateId;
    this.publicKey = publicKey;
  }

  async send(fd: FormData): Promise<boolean> {
    // Convertimos FormData → objeto plano (EmailJS lo necesita así)
    const payload = Object.fromEntries(fd.entries());

    const res: EmailJSResponseStatus = await emailjs.send(
      this.serviceId,
      this.templateId,
      payload,
      this.publicKey
    );

    if (res.status === 200) return true;

    throw new Error('EmailJS: send failed');
  }

}

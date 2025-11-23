import { inject, Injectable } from '@angular/core';
import { RecaptchaService } from '../recaptcha/recaptcha.service';
import { MailProvider } from './mail-provider';
import { MAIL_PROVIDER } from './mail-provider.token';
import { environment } from '../../../../environments/environment';

/**
 * Servicio centralizado que:
 * - Normaliza datos a FormData
 * - Agrega token de reCAPTCHA v3
 * - Delega envío al proveedor seleccionado dinámicamente
 */
@Injectable({
  providedIn: 'root'
})
export class MailService {

  private provider = inject<MailProvider>(MAIL_PROVIDER);
  private recaptcha = inject(RecaptchaService);

  private readonly isSimulated = environment.mail.provider === 'mock';
  private readonly currentProviderName = environment.mail.provider;
  private readonly logPrefix = this.isSimulated ? '🧪 SIMULADO' : '🚀 REAL';

  async send(data: any): Promise<boolean> {
    const fd = this.toFormData(data);

    // Token de seguridad
    const token = await this.recaptcha.execute('contact_us');
    fd.append('g-recaptcha-response', token);

    // LOG DE MODO
    console.info(`[MAIL] ${this.logPrefix}. Proveedor: ${this.currentProviderName.toUpperCase()}`);

    try {
      const result = await this.provider.send(fd);

      // ✅ LOG DE ÉXITO CENTRALIZADO
      console.log(`[MAIL] ✅ Éxito. Mensaje enviado correctamente vía ${this.currentProviderName}.`);

      return result;

    } catch (error) {
      // ✅ LOG DE ERROR CENTRALIZADO
      console.error(`[MAIL] ❌ Fallo en el envío. Proveedor: ${this.currentProviderName}.`, error);

      // Si es simulación, añadimos un mensaje extra
      if (this.isSimulated) {
        console.log(
          '%c[MAIL] 🧪 Error simulado: El MockProvider ha fallado intencionalmente.',
          'background: #1e88e5; color: white; padding: 2px 5px; border-radius: 2px;'
        );
      }

      // Relanzamos el error para que el componente lo capture y muestre el Toast
      throw error;
    }
  }

  /** Convierte cualquier objeto a FormData */
  private toFormData(obj: any): FormData {
    if (obj instanceof FormData) return obj;

    const fd = new FormData();
    Object.entries(obj).forEach(([k, v]) => {
      fd.append(k, v as any);
    });
    return fd;
  }

}

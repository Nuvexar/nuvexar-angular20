import { Injectable } from '@angular/core';
import { MailProvider } from '../mail-provider';

/**
 * Proveedor simulado de envío de mail.
 *
 * - Ideal para desarrollo o testing sin costo.
 * - Simula un retardo y un porcentaje de errores.
 * - No realiza ninguna llamada externa.
 */
@Injectable({
  providedIn: 'root'
})
export class MockMailProvider implements MailProvider {

  /** Tiempo artificial para simular latencia de red */
  private delay = 1200;

  /** Probabilidad de éxito (0.6 = 60%) */
  private successProbability = 0.6;

  async send(formData: FormData): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        const ok = Math.random() < this.successProbability;
        ok ? resolve(true) : reject(new Error('MockMailProvider: Simulated send failure'));
      }, this.delay);
    });
  }

}

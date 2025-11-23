/**
 * Formspree
 * ------------------------------
 * Servicio para encapsular el envío de formularios a Formspree.
 * - Envía FormData mediante fetch al endpoint configurado.
 * - Soporta MODO SIMULADO para pruebas locales (no realiza llamadas reales).
 *
 * Uso típico:
 *  const fd = new FormData(formElement);
 *  fd.append('g-recaptcha-response', token);
 *  await formspree.send(fd);
 *
 * Observaciones:
 * - Devuelve true si la respuesta HTTP fue ok (2xx),
 *   o lanza excepción con detalles del error.
 */

import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { MailProvider } from '../mail-provider';

/**
 * Proveedor real para Formspree.
 * Documentación: https://formspree.io/
 */
@Injectable({
  providedIn: 'root'
})
export class FormspreeMailProvider implements MailProvider {

  private endpoint: string;

  constructor() {
    // Lectura segura del endpoint desde environment
    const url = environment.mail?.formspree?.endpoint;

    // 🚨 Validación explícita
    if (!url || url === 'https://formspree.io/f/REPLACE_ME') {
      throw new Error(
        '[FormspreeMailProvider] Configuration Error: El endpoint de Formspree no está configurado ' +
        'en environment.ts o contiene el placeholder "REPLACE_ME". Por favor, configúrelo antes de usar.'
      );
    }

    this.endpoint = url;
  }

  async send(formData: FormData): Promise<boolean> {
    const res = await fetch(this.endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json', // recomendado por Formspree
      },
    });

    if (res.ok) return true;

    // intentamos leer el body con información del error
    try {
      const json = await res.json();
      throw new Error(json.error || json.message || `Formspree error ${res.status}`);
    } catch (err) {
      // Si el body no es JSON, lanzamos un mensaje genérico
      throw new Error((err as Error)?.message || `Formspree failed with status ${res.status}`);
    }
  }

}

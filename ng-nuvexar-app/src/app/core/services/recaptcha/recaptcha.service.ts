/**
 * Recaptcha
 * ------------------------------
 * Servicio para encapsular la interacción con Google reCAPTCHA v3.
 * - Carga el token usando grecaptcha.execute()
 * - Devuelve una promesa que resuelve el token (string) o rechaza con error
 *
 * NOTAS:
 * - Asegurate de incluir el script de reCAPTCHA en index.html:
 *   <script src="https://www.google.com/recaptcha/api.js?render=TU_SITE_KEY"></script>
 *
 * - Este servicio no hace validación server-side. El token debe validarse en el servidor
 *   si tenés control de backend. En tu caso (Formspree) lo agregamos al payload y el
 *   endpoint receptor decidirá su uso.
 */

import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../environments/environment';

declare const grecaptcha: any; // Google inyecta esto globalmente

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {

  // Inyecciones Angular modernas
  private _document = inject(DOCUMENT);
  private _platformId = inject(PLATFORM_ID);

  // Site key tomada del environment (mejor práctica)
  private siteKey = environment.recaptcha.siteKey;

  private scriptLoaded = false;

  /**
   * Carga el script de reCAPTCHA dinámicamente en el DOM.
   * Solo se carga UNA vez por sesión.
   */
  loadScript(): void {
    if (!isPlatformBrowser(this._platformId)) return;
    if (this.scriptLoaded) return;

    // Evita insertar dos veces
    if (this._document.getElementById('recaptcha-v3-script')) {
      this.scriptLoaded = true;
      return;
    }

    const script = this._document.createElement('script');
    script.id = 'recaptcha-v3-script';
    script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`;
    script.async = true;
    script.defer = true;

    this._document.body.appendChild(script);
    this.scriptLoaded = true;
  }

  /**
   * Ejecuta reCAPTCHA y devuelve el token.
   * Espera a que grecaptcha esté disponible.
   */
  execute(action: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!isPlatformBrowser(this._platformId)) return resolve('');

      this.loadScript(); // Asegura que el script esté cargándose

      let attempts = 0;

      const interval = setInterval(() => {
        attempts++;

        if ((window as any).grecaptcha) {
          clearInterval(interval);

          (window as any).grecaptcha.ready(() => {
            (window as any).grecaptcha
              .execute(this.siteKey, { action })
              .then(resolve)
              .catch(reject);
          });
        }

        // Timeout 5s si Google no carga
        if (attempts > 50) {
          clearInterval(interval);
          reject('No se pudo cargar reCAPTCHA (timeout)');
        }

      }, 100);
    });
  }

}

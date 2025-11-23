import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';

/**
 * Proveedor para Web3Forms.
 * Documentación: https://web3forms.com/
 */
@Injectable({
  providedIn: 'root'
})
export class Web3formsMailProvider {

  private endpoint: string;
  private accessKey: string;

  constructor() {
    const endpoint = environment.mail?.web3forms?.endpoint;
    const key = environment.mail?.web3forms?.accessKey;

    if (!endpoint || endpoint === 'REPLACE_WITH_ENDPOINT') {
      throw new Error(
        '[Web3formsMailProviderTs] Configuration Error: endpoint no configurado en environment.ts'
      );
    }

    if (!key || key === 'REPLACE_WITH_ACCESS_KEY') {
      throw new Error(
        '[Web3formsMailProviderTs] Configuration Error: accessKey no configurado en environment.ts'
      );
    }

    this.endpoint = endpoint;
    this.accessKey = key;
  }

  async send(fd: FormData): Promise<boolean> {
    // Web3Forms requiere que le agregues la access_key
    fd.append('access_key', this.accessKey);

    const res = await fetch(this.endpoint, {
      method: 'POST',
      body: fd
    });

    const json = await res.json();
    if (json.success) return true;

    throw new Error(`Web3Forms: ${json.message || 'Unknown error'}`);
  }

}

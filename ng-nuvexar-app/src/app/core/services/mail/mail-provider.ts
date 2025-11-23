/**
 * Contrato que deben cumplir TODOS los proveedores de mail.
 * El MailService ya entrega un FormData final (normalizado + con token reCAPTCHA).
 * Cada proveedor solo debe encargarse de hacer la petición HTTP.
 */
export interface MailProvider {
  /**
   * Envía la petición de correo.
   * @param payload Los datos del formulario listos para ser enviados,
   * incluyendo el token de reCAPTCHA v3.
   * @returns Una Promesa que resuelve a 'true' si el envío fue exitoso.
   * Debe lanzar un error si falla.
   */
  send(payload: FormData): Promise<boolean>;
}

import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, Renderer2, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OnView } from '../../../shared/directives/on-view';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { RecaptchaService } from '../../../core/services/recaptcha/recaptcha.service';
import { MailService } from '../../../core/services/mail/mail.service';

@Component({
  selector: 'app-contact',
  imports: [OnView, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// Implementamos OnInit para cargar el script al inicio
export class Contact implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private renderer = inject(Renderer2);
  private mailService = inject(MailService);
  private recaptchaService = inject(RecaptchaService);

  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    service: [''],
    message: ['', [Validators.required]],
  });

  loading = signal(false);

  /**
   * CICLO DE VIDA: OnInit
   * ---------------------
   * Apenas este componente se muestra en pantalla (o se carga),
   * invocamos loadScript().
   * * ¿Por qué aquí?
   * 1. Para que aparezca el logo de "Protected by reCAPTCHA" visualmente.
   * 2. Para que Google empiece a analizar el comportamiento del usuario (movimiento de mouse, clicks)
   * mientras rellena el formulario. Esto asegura un puntaje (score) más preciso.
   */
  ngOnInit(): void {
    // Carga script + muestra badge
    this.recaptchaService.loadScript();
    this.renderer.addClass(document.body, 'recaptcha-visible');
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'recaptcha-visible');
  }

  // Convertimos onSubmit en async para esperar la respuesta de Google
  async onSubmit() {
    console.log('Intentando enviar formulario:', this.form.value);

    // 1. Validación básica del formulario
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Completa los campos requeridos correctamente', 'error');
      console.log('Formulario inválido por campos vacíos o erróneos');
      return;
    }

    // 2. Iniciamos estado de carga (bloquea botón submit)
    this.loading.set(true);

    try {
      // 3. SEGURIDAD: Ejecutamos reCAPTCHA v3
      // Esperamos (await) a que Google nos dé el token.
      // La acción 'contact_submit' sirve para ver estadísticas en la consola de Google.
      const token = await this.recaptchaService.execute('contact_submit');

      console.log('Token de seguridad generado:', token);

      // 4. ENVÍO DE DATOS (Simulación)
      // Aquí es donde normalmente harías tu petición HTTP al backend o Formspree.
      // IMPORTANTE: Deberías enviar el 'token' junto con los datos del formulario.

      await this.mailService.send(this.form.value);

      // 5. Éxito
      this.toast.show('Gracias por tu mensaje. ¡Te responderemos pronto!', 'success');
      this.form.reset();

    } catch (error) {
      // 6. Manejo de Errores
      // Si falla reCAPTCHA o el envío al backend
      console.error('Error en el envío:', error);
      this.toast.show('Hubo un problema enviando el mensaje. Intenta nuevamente.', 'error');

    } finally {
      // 7. Finalizar carga (siempre se ejecuta, haya error o éxito)
      this.loading.set(false);
    }
  }
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OnView } from '../../../shared/directives/on-view';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-contact',
  imports: [OnView, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    service: [''],
    message: ['', [Validators.required]],
  });

  loading = signal(false);

  onSubmit() {
    console.log('Formulario', this.form.value);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // aquí mostrar toast "Completa los campos requeridos"
      console.log('Formulario invalido');

      return;
    }

    this.loading.set(true);

    // Aquí enviar a EmailJS o Formspree
    // Simulación:
    setTimeout(() => {
      this.loading.set(false);

      // Enviar toast de éxito
      this.toast.show('Gracias por tu mensaje. ¡Te responderemos pronto!', 'success');
      // Reset del form
      // this.form.reset();
    }, 1500);
  }
}

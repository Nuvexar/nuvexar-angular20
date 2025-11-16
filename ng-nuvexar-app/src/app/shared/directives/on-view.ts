import { Directive, effect, ElementRef, inject, input, Renderer2, signal } from '@angular/core';

@Directive({
  selector: '[appOnView]',
})
export class OnView {
  animation = input('animate-fadeIn');

  // ⭐ Evita que la animación se repita. Solo se ejecuta una vez.
  private hasAnimated = signal(false);

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  constructor() {
    // ⭐ Estado inicial: oculto → evita parpadeos y flickering antes del observer.
    this.renderer.addClass(this.el.nativeElement, 'opacity-0');

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !this.hasAnimated()) {
          this.hasAnimated.set(true);
        }
      },
      { threshold: 0.2 } // ⭐ Se dispara cuando el 20% del elemento entra a viewport
    );

    observer.observe(this.el.nativeElement);

    // ⭐ Efecto reactivo: corre cuando hasAnimated() cambia o cuando cambia el input()
    effect(() => {
      if (this.hasAnimated()) {
        const anim = this.animation();

        // ⭐ Quita el estado invisible para que el elemento pueda animarse al aparecer
        this.renderer.removeClass(this.el.nativeElement, 'opacity-0');

        // ⭐ Activa la animación especificada por el usuario
        this.renderer.addClass(this.el.nativeElement, anim);
      }
    });
  }
}

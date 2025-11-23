import { Directive, effect, ElementRef, inject, input, Renderer2, signal, afterNextRender } from '@angular/core';

@Directive({
  selector: '[appOnView]', // ⭐ Se aplica como atributo a cualquier elemento para animarlo al entrar en viewport
})
export class OnView {
  // ⭐ Input opcional: clase de animación que se aplicará al aparecer
  animation = input('animate-fadeIn');

  // ⭐ Evita que la animación se repita. Solo se ejecuta una vez.
  private hasAnimated = signal(false);

  private el = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);

  constructor() {
    const element = this.el.nativeElement;

    // ⭐ Estado inicial: oculto → evita parpadeos y flickering antes del observer
    this.renderer.addClass(element, 'opacity-0');

    // ⭐ IntersectionObserver para detectar cuando el elemento entra al viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // ⭐ Si el elemento entra en viewport y aún no ha animado, activa la animación
        if (entry.isIntersecting && !this.hasAnimated()) {
          this.hasAnimated.set(true);
        }
      },
      { threshold: 0.2 } // ⭐ Se dispara cuando al menos 20% del elemento es visible
    );
    observer.observe(element);

    // ⭐ Verificación inicial robusta: espera al siguiente render y frame para asegurar layout completo
    afterNextRender(() => {
      const checkVisibility = () => {
        const rect = element.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        // ⭐ Si ya está visible al cargar la página, dispara la animación
        if (inView && !this.hasAnimated()) {
          this.hasAnimated.set(true);
        }
      };
      // Ejecuta en el siguiente frame para asegurar layout completo
      requestAnimationFrame(checkVisibility);
    });

    // ⭐ Efecto reactivo: corre cuando hasAnimated() cambia o cuando cambia el input()
    effect(() => {
      if (this.hasAnimated()) {
        const animClass = this.animation();

        // ⭐ Quita el estado invisible para que el elemento pueda animarse al aparecer
        this.renderer.removeClass(element, 'opacity-0');

        // ⭐ Activa la animación especificada por el usuario
        this.renderer.addClass(element, animClass);
      }
    });
  }
}

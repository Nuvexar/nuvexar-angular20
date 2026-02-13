import { Directive, ElementRef, Renderer2, input, effect, inject, OnDestroy } from '@angular/core';

/**
 * ============================================================================
 *  DIRECTIVA: appBubbles
 * ============================================================================
 *
 * Genera burbujas decorativas dentro del elemento host.
 * Permite:
 *  - Usar posiciones fijas EXACTAS (top/left/right/bottom)
 *  - Usar tamaños fijos o aleatorios
 *  - Usar clases o animaciones personalizadas
 *  - Usar fondo custom
 *  - Crear animación independiente con duración/delay aleatorios
 *
 * Funciona como `appParticles`, pero pensada para BURBUJAS grandes,
 * decorativas, fijas en pantalla, como las del ejemplo que pasaste.
 *
 * ----------------------------------------------------------------------------
 * 🟦 USO MÍNIMO
 *
 *    <div appBubbles></div>
 *
 * → Genera 5 burbujas grandes, posiciones y tamaños aleatorios.
 *
 * ----------------------------------------------------------------------------
 * 🟦 USO INTERMEDIO – Posiciones FIJAS (tipo tu HTML original)
 *
 *    <div
 *      appBubbles
 *      bubblesClass="bubble"
 *      [bubblesPositions]="[
 *        { top: 20, left: 10, size: 150 },
 *        { top: 30, right: 20, size: 80 },
 *        { bottom: 20, left: 5, size: 60 },
 *        { bottom: 10, right: 15, size: 120 },
 *        { top: 60, left: 30, size: 40 }
 *      ]"
 *    ></div>
 *
 * ✔ Reproduce EXACTAMENTE el HTML que pasaste.
 * ✔ No altera posiciones ni tamaños.
 *
 * ----------------------------------------------------------------------------
 * 🟦 USO COMPLETO
 *
 *    <div
 *      appBubbles
 *      bubblesClass="myBubbleClass"
 *      bubblesAnimation="myCustomAnimation"
 *      bubblesBackground="rgba(0,150,255,0.25)"
 *      [bubblesCount]="10"
 *      [bubblesMinSize]="50"
 *      [bubblesMaxSize]="120"
 *      [bubblesPositions]="[
 *        { top: 10, left: 15 },
 *        { bottom: 10, right: 5 }
 *      ]"
 *    ></div>
 *
 * ✔ Si `size` está en cada item → se respeta.
 * ✔ Si NO → se calcula aleatorio entre min/max.
 *
 * ----------------------------------------------------------------------------
 * 🟦 REGLAS DE ANIMACIÓN (idénticas a Particles)
 *
 * 1. NO se pasa bubblesClass:
 *       → Usa clase interna "bubble" + animación "float".
 *
 * 2. Se pasa bubblesClass:
 *       a) Si la clase NO tiene animación → burbujas fijas.
 *       b) Si la clase tiene animación → agrega duration/delay aleatorios.
 *
 * 3. Se pasa bubblesClass + bubblesAnimation:
 *       → GANA siempre bubblesAnimation.
 *
 * 4. bubblesBackground sobrescribe cualquier background.
 *
 * ============================================================================
 */

/** Tipo exacto para cada burbuja */
export type BubblePosition = {
  size?: number;

  left?: number;
  right?: number;

  top?: number;
  bottom?: number;
};

@Directive({
  selector: '[appBubbles]',
})
export class Bubbles implements OnDestroy {
  // ---------------------------------------------
  // Inputs (Angular 20 Signals)
  // ---------------------------------------------
  bubblesClass = input<string | null>(null);
  bubblesAnimation = input<string | null>(null);
  bubblesBackground = input<string | null>(null);

  bubblesCount = input<number>(5);
  bubblesMinSize = input<number>(60);
  bubblesMaxSize = input<number>(150);

  /** Lista completa de burbujas (posiciones exactas o parciales) */
  bubblesPositions = input<BubblePosition[]>([]);

  // ---------------------------------------------
  // Inyección moderna (Angular 20)
  // ---------------------------------------------
  private host = inject(ElementRef<HTMLElement>);
  private r = inject(Renderer2);

  private bubbles: HTMLElement[] = [];

  // ---------------------------------------------
  // Efecto principal: recrea siempre las burbujas
  // ---------------------------------------------
  bubblesEffect = effect(() => {
    this.cleanup();
    this.createBubbles();
  });

  // =======================================================================
  // Crear burbujas
  // =======================================================================
  private createBubbles() {
    const hostEl = this.host.nativeElement;
    const cls = this.bubblesClass();
    const animInput = this.bubblesAnimation();
    const bgInput = this.bubblesBackground();

    const useDefaultClass = cls === null;
    const finalClass = cls ?? 'bubble';

    const positions = this.bubblesPositions();

    const total = positions.length > 0 ? positions.length : this.bubblesCount();

    for (let i = 0; i < total; i++) {
      const el = this.r.createElement('div');

      // Clase final aplicada
      this.r.addClass(el, finalClass);

      // Fondo custom (si vino)
      if (bgInput) {
        this.r.setStyle(el, 'background', bgInput);
      }

      const pos = positions[i];

      // Tamaño
      const size = pos?.size ?? this.randomSize();
      this.r.setStyle(el, 'width', `${size}px`);
      this.r.setStyle(el, 'height', `${size}px`);

      // Posición fija si existe
      if (pos) {
        if (pos.left !== undefined) this.r.setStyle(el, 'left', `${pos.left}%`);
        if (pos.right !== undefined) this.r.setStyle(el, 'right', `${pos.right}%`);
        if (pos.top !== undefined) this.r.setStyle(el, 'top', `${pos.top}%`);
        if (pos.bottom !== undefined) this.r.setStyle(el, 'bottom', `${pos.bottom}%`);
      } else {
        // Sino → posición aleatoria
        this.r.setStyle(el, 'left', `${Math.random() * 100}%`);
        this.r.setStyle(el, 'top', `${Math.random() * 100}%`);
      }

      // -------------------------------
      // APLICAR ANIMACIÓN (duración y delay independientes)
      // -------------------------------
      if (animInput) {
        // Si pasaste bubblesAnimation → siempre gana
        const duration = this.randomDuration();
        const delay = this.randomDelay();

        this.r.setStyle(
          el,
          'animation',
          `${animInput} ${duration}s ${delay}s infinite ease-in-out`
        );
      } else if (useDefaultClass) {
        // No pasaste bubblesClass → usar animación "float" por defecto
        const duration = this.randomDuration();
        const delay = this.randomDelay();

        this.r.setStyle(
          el,
          'animation',
          `float ${duration}s ${delay}s infinite ease-in-out`
        );
      } else {
        // Se pasó bubblesClass → respetar su animación si existe
        const style = getComputedStyle(el);
        const hasAnimation = style.animationName !== 'none';

        if (hasAnimation) {
          this.r.setStyle(el, 'animation-duration', `${this.randomDuration()}s`);
          this.r.setStyle(el, 'animation-delay', `${this.randomDelay()}s`);
        }
      }

      this.r.appendChild(hostEl, el);
      this.bubbles.push(el);
    }
  }

  private randomSize() {
    return Math.random() * (this.bubblesMaxSize() - this.bubblesMinSize()) + this.bubblesMinSize();
  }

  private randomDuration() {
    return Math.random() * 20 + 10;
  }

  private randomDelay() {
    return Math.random() * 5;
  }

  // =======================================================================
  // Cleanup
  // =======================================================================
  private cleanup() {
    for (const el of this.bubbles) {
      this.r.removeChild(this.host.nativeElement, el);
    }
    this.bubbles = [];
  }

  ngOnDestroy() {
    this.cleanup();
  }
}

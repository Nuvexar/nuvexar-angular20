import { Directive, ElementRef, Renderer2, effect, input } from '@angular/core';

/**
 * ============================================================================
 *  DIRECTIVA: appParticles
 * ============================================================================
 *
 * Genera partículas flotantes dentro del elemento host.
 * Incluye valores por defecto, soporte para clases y animaciones personalizadas,
 * y movimiento independiente con duración/delay aleatorios.
 *
 * ----------------------------------------------------------------------------
 * USO MÍNIMO (funciona sin configuración):
 *
 *    <div appParticles></div>
 *
 * → Usa clase .particle + animación float + movimiento independiente.
 *
 * ----------------------------------------------------------------------------
 * USO CON ESTILOS PERSONALIZADOS:
 *
 *    <div appParticles particlesClass="bubble"></div>
 *
 * - Si "bubble" NO tiene animación → partículas fijas.
 * - Si "bubble" TIENE animación → se respeta y se agregan duración/delay aleatorios.
 *
 * ----------------------------------------------------------------------------
 * USO COMPLETO:
 *
 *    <div
 *      appParticles
 *      particlesClass="bubble"
 *      particlesAnimation="spin"
 *      [particlesBackground]="'rgba(255,0,0,0.3)'"
 *      [particlesCount]="12"
 *      [particlesMinSize]="10"
 *      [particlesMaxSize]="60"
 *    ></div>
 *
 * → Gana particlesAnimation sobre cualquier otra animación.
 *
 * ----------------------------------------------------------------------------
 * REGLAS PRINCIPALES:
 *
 * 1. NO se pasa particlesClass:
 *      → Se usa clase interna "particle" + animación "float".
 *
 * 2. Se pasa particlesClass:
 *      a) Si la clase NO tiene animación → partículas fijas.
 *      b) Si la clase tiene animación → movimiento independiente (duration/delay aleatorios).
 *
 * 3. Se pasa particlesClass + particlesAnimation:
 *      → Siempre gana particlesAnimation.
 *
 * 4. NO particlesClass pero SÍ particlesAnimation:
 *      → Usa clase interna "particle" pero con tu animación custom.
 *
 * 5. particlesBackground sobrescribe el background de la clase o del default.
 *
 * ============================================================================
 */

@Directive({
  selector: '[appParticles]',
})
export class Particles {
  // -----------------------------
  // Inputs (Angular 20 Signals)
  // -----------------------------
  particlesClass = input<string | null>(null);
  particlesAnimation = input<string | null>(null);
  particlesBackground = input<string | null>(null);

  particlesCount = input<number>(20);
  particlesMinSize = input<number>(2);
  particlesMaxSize = input<number>(6);

  private particles: HTMLElement[] = [];

  constructor(private host: ElementRef<HTMLElement>, private r: Renderer2) {}

  /**
   * Efecto reactivo:
   * Cada vez que cambia un input → se regeneran las partículas.
   */
  particlesEffect = effect(() => {
    this.cleanupParticles();
    this.createParticles();
  });

  // ---------------------------------------------------------------------------
  // Crear partículas
  // ---------------------------------------------------------------------------
  private createParticles() {
    const hostEl = this.host.nativeElement;
    const cls = this.particlesClass();
    const animInput = this.particlesAnimation();
    const bgInput = this.particlesBackground();

    const useDefaultClass = cls === null;
    const finalClass = cls ?? 'particle';

    for (let i = 0; i < this.particlesCount(); i++) {
      const p = this.r.createElement('div');

      // Clase final aplicada
      this.r.addClass(p, finalClass);

      // Fondo custom (si vino)
      if (bgInput) {
        this.r.setStyle(p, 'background', bgInput);
      }

      // Tamaño aleatorio
      const size =
        Math.random() * (this.particlesMaxSize() - this.particlesMinSize()) +
        this.particlesMinSize();

      this.r.setStyle(p, 'width', `${size}px`);
      this.r.setStyle(p, 'height', `${size}px`);

      // Posición aleatoria
      this.r.setStyle(p, 'left', `${Math.random() * 100}%`);
      this.r.setStyle(p, 'top', `${Math.random() * 100}%`);

      // ---------------------------------------------------------
      // APLICAR ANIMACIÓN (duración y delay independientes)
      // ---------------------------------------------------------

      if (animInput) {
        // Si pasaste particlesAnimation → siempre gana
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;

        this.r.setStyle(
          p,
          'animation',
          `${animInput} ${duration}s ${delay}s infinite ease-in-out`
        );
      } else if (useDefaultClass) {
        // No pasaste particlesClass → usar animación "float" por defecto
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;

        this.r.setStyle(
          p,
          'animation',
          `float ${duration}s ${delay}s infinite ease-in-out`
        );
      } else {
        // Se pasó particlesClass → respetar su animación si existe
        const style = getComputedStyle(p);
        const hasAnimation = style.animationName !== 'none';

        if (hasAnimation) {
          const duration = Math.random() * 20 + 10;
          const delay = Math.random() * 5;

          this.r.setStyle(p, 'animation-duration', `${duration}s`);
          this.r.setStyle(p, 'animation-delay', `${delay}s`);
        }
      }

      this.r.appendChild(hostEl, p);
      this.particles.push(p);
    }
  }

  // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------
  private cleanupParticles() {
    for (const p of this.particles) {
      this.r.removeChild(this.host.nativeElement, p);
    }
    this.particles = [];
  }

  ngOnDestroy() {
    this.cleanupParticles();
  }
}

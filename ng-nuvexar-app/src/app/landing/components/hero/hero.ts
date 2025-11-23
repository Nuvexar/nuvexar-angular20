import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Particles } from '../../../shared/directives/particles';
import { Bubbles } from '../../../shared/directives/bubbles';

@Component({
  selector: 'app-hero',
  imports: [Particles, Bubbles],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero { }

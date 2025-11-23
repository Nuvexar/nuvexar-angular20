import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Particles } from '../../../shared/directives/particles';
import { Bubbles } from '../../../shared/directives/bubbles';

@Component({
  selector: 'app-footer',
  imports: [Particles, Bubbles],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer { }

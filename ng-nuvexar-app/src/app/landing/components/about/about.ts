import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OnView } from '../../../shared/directives/on-view';
import { Particles } from '../../../shared/directives/particles';
import { Bubbles } from '../../../shared/directives/bubbles';

@Component({
  selector: 'app-about',
  imports: [OnView, Particles, Bubbles],
  templateUrl: './about.html',
  styleUrl: './about.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About { }

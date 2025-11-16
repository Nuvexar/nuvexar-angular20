import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OnView } from '../../../shared/directives/on-view';

@Component({
  selector: 'app-about',
  imports: [OnView],
  templateUrl: './about.html',
  styleUrl: './about.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About { }

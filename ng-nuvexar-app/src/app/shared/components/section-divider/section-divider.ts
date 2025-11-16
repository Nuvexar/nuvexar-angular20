import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-divider',
  imports: [],
  templateUrl: './section-divider.html',
  styleUrl: './section-divider.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionDivider {
  readonly type = input<'top' | 'bottom'>('top');
}

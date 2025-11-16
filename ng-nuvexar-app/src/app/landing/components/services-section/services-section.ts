import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OnView } from '../../../shared/directives/on-view';

@Component({
  selector: 'app-services-section',
  imports: [OnView],
  templateUrl: './services-section.html',
  styleUrl: './services-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesSection { }

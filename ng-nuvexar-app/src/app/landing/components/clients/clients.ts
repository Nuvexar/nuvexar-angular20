import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { OnView } from '../../../shared/directives/on-view';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-clients',
  imports: [OnView, RouterLink],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Clients {
  activeTab = signal<'web' | 'social'>('web');

  setTab(tab: 'web' | 'social') {
    this.activeTab.set(tab);
  }
}

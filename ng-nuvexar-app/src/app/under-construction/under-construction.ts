import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Particles } from '../shared/directives/particles';
import { Bubbles } from '../shared/directives/bubbles';

@Component({
  selector: 'app-under-construction',
  imports: [RouterLink, Particles, Bubbles],
  templateUrl: './under-construction.html',
  styleUrl: './under-construction.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnderConstruction { }

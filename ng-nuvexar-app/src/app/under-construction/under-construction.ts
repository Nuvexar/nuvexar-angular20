import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-under-construction',
  imports: [RouterLink],
  templateUrl: './under-construction.html',
  styleUrl: './under-construction.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnderConstruction { }

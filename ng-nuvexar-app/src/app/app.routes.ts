import { Routes } from '@angular/router';
import { LandingPage } from './landing/pages/landing-page/landing-page';
import { UnderConstruction } from './under-construction/under-construction';

export const routes: Routes = [
  // Página principal
  {
    path: '',
    component: LandingPage,
    title: 'Nuvexar — Innovación y Software'
  },

  // Página de proyecto en construcción
  {
    path: 'proyecto-en-construccion',
    component: UnderConstruction,
    title: 'Proyecto en Construcción'
  },

  // Si una ruta no existe → ir al landing
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

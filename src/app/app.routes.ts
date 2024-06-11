import { Routes } from '@angular/router'
import { ApuestasBindingComponent } from './apuestas-binding/apuestas-binding.component'
import { ApuestasReactiveComponent } from './apuestas-reactive/apuestas-reactive.component'

export const routes: Routes = [
  { path: 'reactive', component: ApuestasReactiveComponent },
  { path: '**', component: ApuestasBindingComponent }
]

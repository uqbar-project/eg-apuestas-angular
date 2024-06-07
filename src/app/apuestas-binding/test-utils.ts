import { AppComponent } from './app.component'
import { ComponentFixture } from '@angular/core/testing'

export const getByTestId = (appComponent: ComponentFixture<AppComponent>, testId: string) => {
  const compiled = appComponent.debugElement.nativeElement
  return compiled.querySelector(`[data-testid="${testId}"]`)
}

export const mensajeDeError = (fixture: ComponentFixture<AppComponent>, field: string) => {
  return getByTestId(fixture, `errorMessage-${field}`).textContent
}

export const resultado = (fixture: ComponentFixture<AppComponent>) => {
  return getByTestId(fixture, 'resultado').textContent
}

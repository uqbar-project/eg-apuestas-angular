import { ComponentFixture } from '@angular/core/testing'

export const getByTestId = (appComponent: ComponentFixture<unknown>, testId: string) => {
  const compiled = appComponent.debugElement.nativeElement
  return compiled.querySelector(`[data-testid="${testId}"]`)
}

export const mensajeDeError = (fixture: ComponentFixture<unknown>, field: string) => {
  return getByTestId(fixture, `errorMessage-${field}`).textContent
}

export const resultado = (fixture: ComponentFixture<unknown>) => {
  return getByTestId(fixture, 'resultado').textContent
}

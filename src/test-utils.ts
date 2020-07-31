export const getByTestId = (appComponent: any, testId: string) => {
  const compiled = appComponent.debugElement.nativeElement
  return compiled.querySelector(`[data-testid="${testId}"]`)
}

export const mensajeDeError = (fixture: any) => {
  return getByTestId(fixture, 'errorMessage').textContent
}

export const resultado = (fixture: any) => {
  return getByTestId(fixture, 'resultado').textContent
}

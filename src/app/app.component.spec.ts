import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ValidationFieldComponent } from './validationField/validationField.component'

import { AppComponent } from './app.component'
import './app.module'
import { importedModules } from './app.module'
import { Apuesta, DOCENA, PLENO, TipoApuesta } from './apuesta'
import { getByTestId, mensajeDeError, resultado } from './test-utils'

let fixture: ComponentFixture<AppComponent>
let app: AppComponent

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ValidationFieldComponent,
      ],
      imports: importedModules,
    }).compileComponents()
    fixture = TestBed.createComponent(AppComponent)
    app = fixture.debugElement.componentInstance
  })
  it('should create the app', () => {
    expect(app).toBeTruthy()
  })
  it('should fail if no date is entered', () => {
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()
    expect(mensajeDeError(fixture, 'fecha')).toContain('Debe ingresar una fecha de apuesta')
  })
  it('should fail if previous date is entered', () => {
    app.apuesta = Object.assign(
      new Apuesta(),
      {
        fecha: new Date(1900, 1, 1),
      }
    )
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()
    expect(mensajeDeError(fixture, 'fecha')).toContain('Debe ingresar una fecha actual o posterior al día de hoy')
  })
  it('should fail if negative amount is entered', () => {
    app.apuesta = Object.assign(
      new Apuesta(),
      {
        fecha: new Date(),
        monto: -10,
      }
    )
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()
    expect(mensajeDeError(fixture, 'monto')).toContain('El monto a apostar debe ser positivo')
  })
  it('should pass all validations and inform if user wins - single', () => {
    app.apuesta = apostarAl(PLENO, 25)
    spyOn(app.apuesta, "obtenerNumeroGanador").and.returnValue(25)
    // se podría hacer a mano pero hay que deshacer esto al final del test
    // o produciría efecto colateral => el número ganador sería siempre 24
    // app.apuesta.obtenerNumeroGanador = () => 25
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()

    expect(resultado(fixture)).toContain('Ganaste $700')
  })
  it('should pass all validations and inform if user looses - single', () => {
    app.apuesta = apostarAl(PLENO, 25)
    spyOn(app.apuesta, "obtenerNumeroGanador").and.returnValue(24)
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()

    expect(resultado(fixture)).toContain('¡¡Perdiste!! Salió el 24')
  })
  it('should pass all validations and inform if user wins - dozen', () => {
    app.apuesta = apostarAl(DOCENA, 'Primera', 100)
    spyOn(app.apuesta, "obtenerNumeroGanador").and.returnValue(1)
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()

    expect(resultado(fixture)).toContain('Ganaste $1100')
  })
  it('should pass all validations and inform if user looses - dozen', () => {
    app.apuesta = apostarAl(DOCENA, 'Segunda', 100)
    spyOn(app.apuesta, "obtenerNumeroGanador").and.returnValue(1)
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()

    expect(resultado(fixture)).toContain('¡¡Perdiste!! Salió el 1')
  })
})

function apostarAl(tipoApuesta: TipoApuesta, numero: number | string, monto = 20): Apuesta {
  const apuesta = new Apuesta()
  apuesta.fecha = new Date()
  apuesta.monto = monto
  apuesta.tipoApuesta = tipoApuesta
  apuesta.valorApostado = numero
  return apuesta
}

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { AngularMyDatePickerModule } from 'angular-mydatepicker'

import { AppComponent } from './app.component'
import { Apuesta, PLENO, DOCENA, TipoApuesta } from './apuesta'
import { getByTestId, mensajeDeError, resultado } from './test-utils'

let fixture: ComponentFixture<AppComponent>
let app: AppComponent

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        AngularMyDatePickerModule,
        BrowserModule,
        FormsModule,
        FontAwesomeModule,
      ],
    }).compileComponents()
    fixture = TestBed.createComponent(AppComponent)
    app = fixture.debugElement.componentInstance
  }))
  it('should create the app', waitForAsync(() => {
    expect(app).toBeTruthy()
  }))
  it('should fail if no date is entered', waitForAsync(() => {
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()
    expect(mensajeDeError(fixture)).toContain('Debe ingresar una fecha de apuesta')
  }))  
  it('should fail if previous date is entered', waitForAsync(() => {
    app.apuesta = Object.assign(
      new Apuesta(),
      {
        fecha: new Date(1900, 1, 1),
      }
    )
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()
    expect(mensajeDeError(fixture)).toContain('Debe ingresar una fecha actual o posterior al día de hoy')
  }))
  it('should fail if negative amount is entered', waitForAsync(() => {
    app.apuesta = Object.assign(
      new Apuesta(),
      {
        fecha: new Date(),
        monto: -10,
      }
    )
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()
    expect(mensajeDeError(fixture)).toContain('El monto a apostar debe ser positivo')
  }))
  it('should pass all validations and inform if user wins - single', waitForAsync(() => {
    app.apuesta = apostarAl(PLENO, 25)
    app.apuesta.obtenerNumeroGanador = () => 25
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()

    expect(resultado(fixture)).toContain('Ganaste $700')
  }))
  it('should pass all validations and inform if user looses - single', waitForAsync(() => {
    app.apuesta = apostarAl(PLENO, 25)
    app.apuesta.obtenerNumeroGanador = () => 24
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()

    expect(resultado(fixture)).toContain('¡¡Perdiste!! Salió el 24')
  }))
  it('should pass all validations and inform if user wins - dozen', waitForAsync(() => {
    app.apuesta = apostarAl(DOCENA, 'Primera', 100)
    app.apuesta.obtenerNumeroGanador = () => 1
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()

    expect(resultado(fixture)).toContain('Ganaste $1100')
  }))
  it('should pass all validations and inform if user looses - dozen', waitForAsync(() => {
    app.apuesta = apostarAl(DOCENA, 'Segunda', 100)
    app.apuesta.obtenerNumeroGanador = () => 1
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()

    expect(resultado(fixture)).toContain('¡¡Perdiste!! Salió el 1')
  }))
})

function apostarAl(tipoApuesta: TipoApuesta, numero: number | string, monto = 20): Apuesta {
  const apuesta = new Apuesta()
  apuesta.fecha = new Date()
  apuesta.monto = monto
  apuesta.tipoApuesta = tipoApuesta
  apuesta.valorApostado = numero
  return apuesta
}


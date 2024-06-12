import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ApuestasBindingComponent } from './apuestas-binding.component'
import { Apuesta, DOCENA, PLENO, TipoApuesta } from '../domain/apuesta'
import dayjs from 'dayjs'

describe('ApuestasBindingComponent', () => {
  let component: ApuestasBindingComponent
  let fixture: ComponentFixture<ApuestasBindingComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApuestasBindingComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ApuestasBindingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
  it('should fail if no date is entered', () => {
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()
    expect(mensajeDeError(fixture, 'fecha')).toContain('Debe ingresar una fecha de apuesta')
  })
  it('should fail if previous date is entered', () => {
    component.fechaApuesta = '01/01/1900'
    component.apuesta = new Apuesta()
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()
    expect(mensajeDeError(fixture, 'fecha')).toContain('Debe ingresar una fecha actual o posterior al día de hoy')
  })
  it('should fail if negative amount is entered', () => {
    apostarHoy(component)
    component.apuesta = Object.assign(
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
    apostarHoy(component)
    component.apuesta = apostarAl(PLENO, 25)

    spyOn(component.apuesta, 'obtenerNumeroGanador').and.returnValue(25)
    // se podría hacer a mano pero hay que deshacer esto al final del test
    // o produciría efecto colateral => el número ganador sería siempre 24
    // component.apuesta.obtenerNumeroGanador = () => 25
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()

    expect(resultado(fixture)).toContain('Ganaste $700')
  })
  it('should pass all validations and inform if user loses - single', () => {
    apostarHoy(component)
    component.apuesta = apostarAl(PLENO, 25)
    spyOn(component.apuesta, 'obtenerNumeroGanador').and.returnValue(24)
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()

    expect(resultado(fixture)).toContain('¡¡Perdiste!! Salió el 24')
  })
  it('should pass all validations and inform if user wins - dozen', () => {
    apostarHoy(component)
    component.apuesta = apostarAl(DOCENA, 'Primera', 100)
    spyOn(component.apuesta, 'obtenerNumeroGanador').and.returnValue(1)
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()

    expect(resultado(fixture)).toContain('Ganaste $1100')
  })
  it('should pass all validations and inform if user loses - dozen', () => {
    apostarHoy(component)
    component.apuesta = apostarAl(DOCENA, 'Segunda', 100)
    spyOn(component.apuesta, 'obtenerNumeroGanador').and.returnValue(1)
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()

    expect(resultado(fixture)).toContain('¡¡Perdiste!! Salió el 1')
  })

})

function apostarAl(tipoApuesta: TipoApuesta, numero: number | string, monto = 20): Apuesta {
  const apuesta = new Apuesta()
  apuesta.monto = monto
  apuesta.tipoApuesta = tipoApuesta
  apuesta.valorApostado = numero
  return apuesta
}

const apostarHoy = (component: ApuestasBindingComponent) => {
  component.fechaApuesta = dayjs(new Date()).format('DD/MM/YYYY')
}

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
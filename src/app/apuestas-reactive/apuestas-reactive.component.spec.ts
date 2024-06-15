import { ComponentFixture, TestBed } from '@angular/core/testing'

import dayjs from 'dayjs'
import { Apuesta } from 'app/domain/apuesta'
import { ApuestasReactiveComponent } from './apuestas-reactive.component'

describe('ApuestasReactiveComponent', () => {
  let component: ApuestasReactiveComponent
  let fixture: ComponentFixture<ApuestasReactiveComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApuestasReactiveComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(ApuestasReactiveComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
  it('should fail if no date is entered', () => {
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()
    expect(mensajeDeError(fixture, 'fecha')).toContain('Debe ingresar fecha')
  })
  it('should fail if previous date is entered', () => {
    apostarElDia(component, '01/01/1900')
    component.apuesta = new Apuesta()
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()
    expect(mensajeDeError(fixture, 'fecha')).toContain('Debe ingresar fecha de hoy o futura')
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
    expect(mensajeDeError(fixture, 'monto')).toContain('Debe ingresar un valor mayor para monto')
  })
  it('should pass all validations and inform if user wins - single', () => {
    apostarHoy(component)
    apostarAl(component, 25)

    const hacerGanarSpy = spyOn(component.apuesta, 'obtenerNumeroGanador').and.returnValue(25)
    // se podría hacer a mano pero hay que deshacer esto al final del test
    // o produciría efecto colateral => el número ganador sería siempre 24
    // component.apuesta.obtenerNumeroGanador = () => 25
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()
    hacerGanarSpy.calls.reset()

    expect(resultado(fixture)).toContain('Ganaste $700')
  })
  it('should pass all validations and inform if user loses - single', () => {
    apostarHoy(component)
    apostarAl(component, 25)
    const hacerPerderSpy = spyOn(component.apuesta, 'obtenerNumeroGanador').and.returnValue(24)
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()
    hacerPerderSpy.calls.reset()

    expect(resultado(fixture)).toContain('¡¡Perdiste!! Salió el 24')
  })

})

const apostarAl = (component: ApuestasReactiveComponent, numero: number, monto = 20) => {
  component.apuestaForm.get('monto')?.setValue(monto.toString())
  component.apuestaForm.get('valorApostado')?.setValue(numero)
}

const apostarHoy = (component: ApuestasReactiveComponent) => {
  apostarElDia(component, dayjs(new Date()).format('DD/MM/YYYY'))
}

const apostarElDia = (component: ApuestasReactiveComponent, fecha: string) => {
  component.apuestaForm.get('fecha')?.setValue(fecha)
}

export const getByTestId = (appComponent: ComponentFixture<ApuestasReactiveComponent>, testId: string) => {
  const compiled = appComponent.debugElement.nativeElement
  return compiled.querySelector(`[data-testid="${testId}"]`)
}

export const mensajeDeError = (fixture: ComponentFixture<ApuestasReactiveComponent>, field: string) => {
  return getByTestId(fixture, `errorMessage-${field}`).textContent
}

export const resultado = (fixture: ComponentFixture<ApuestasReactiveComponent>) => {
  return getByTestId(fixture, 'resultado').textContent
}
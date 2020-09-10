import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { AngularMyDatePickerModule } from 'angular-mydatepicker'

import { AppComponent } from './app.component'
import { Apuesta, PLENO } from './apuesta'
import { getByTestId, mensajeDeError, resultado } from './test-utils'

let fixture: ComponentFixture<AppComponent>
let app: any

describe('AppComponent', () => {
  beforeEach(async(() => {
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
  it('should create the app', async(() => {
    expect(app).toBeTruthy()
  }))
  it('should fail if no date is entered', async(() => {
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()
    expect(mensajeDeError(fixture)).toContain('Debe ingresar una fecha de apuesta')
  }))
  it('should fail if negative amount is entered', async(() => {
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
  it('should pass all validations and inform user win/loose result', async(() => {
    app.apuesta = Object.assign(
      new Apuesta(),
      {
        fecha: new Date(),
        monto: 60,
        tipoApuesta: PLENO,
        valorApostado: 25,
      }
    )
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()
    expect(resultado(fixture)).toBeTruthy()
  }))
})

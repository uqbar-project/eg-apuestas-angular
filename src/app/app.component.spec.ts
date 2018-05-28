import { TestBed, async, ComponentFixture } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { MyDatePickerModule, MyDatePicker } from 'mydatepicker'
import { Apuesta } from './apuesta'

let fixture : ComponentFixture<AppComponent>
let app : any

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        FormsModule,
        MyDatePickerModule
      ],      
    }).compileComponents()
    fixture = TestBed.createComponent(AppComponent)
    app = fixture.debugElement.componentInstance
  }))
  it('should create the app', async(() => {
    expect(app).toBeTruthy()
  }))
  it(`should have as title 'app'`, async(() => {
    expect(app.title).toEqual('app')
  }))
  it('should fail if no date is entered', async(() => {
    fixture.detectChanges()
    let compiled = fixture.debugElement.nativeElement
    app.fechaModel = null
    compiled.querySelector("#btnApuesta").click()
    fixture.detectChanges()
    compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('.alert-danger').textContent).toContain('Debe ingresar una fecha de apuesta')
  }))
  it('should fail if negative amount is entered', async(() => {
    fixture.detectChanges()
    let compiled = fixture.debugElement.nativeElement
    app.apuesta.monto = -10
    compiled.querySelector("#btnApuesta").click()
    fixture.detectChanges()
    compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('.alert-danger').textContent).toContain('El monto a apostar debe ser positivo')
  }))
  it('should pass all validations and inform user win/loose result', async(() => {
    fixture.detectChanges()
    let compiled = fixture.debugElement.nativeElement
    const apuestaValida = new Apuesta()
    apuestaValida.monto = 60
    apuestaValida.tipoApuesta = Apuesta.PLENO
    apuestaValida.valorApostado = 25
    app.apuesta = apuestaValida
    compiled.querySelector("#btnApuesta").click()
    fixture.detectChanges()
    compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('.alert-info').textContent).toBeTruthy()
  }))
})

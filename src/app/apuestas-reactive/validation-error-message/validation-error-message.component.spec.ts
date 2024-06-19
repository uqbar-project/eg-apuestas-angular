import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ValidationErrorMessageComponent } from './validation-error-message.component'
import { FormControl, Validators } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'


describe('ValidationErrorMessageComponent', () => {
  let component: ValidationErrorMessageComponent
  let fixture: ComponentFixture<ValidationErrorMessageComponent>
  let testControl: FormControl<string | null>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationErrorMessageComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(ValidationErrorMessageComponent)
    component = fixture.componentInstance
    testControl = new FormControl("")
    component.control = testControl
    component.fieldName = "email"
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('sin validadores no debería mostrar ningun error', () => {
    expect(getMensajesDeErrorPara(fixture, component.fieldName)).toBeFalsy()
  })

  describe('para un campo requerido', () => {
    beforeEach(() => {
      component.control.addValidators(Validators.required)
    })

    it('no debería mostrar nada mientras no se interactúe', () => {
      fixture.detectChanges()
      expect(getMensajesDeErrorPara(fixture, component.fieldName)).toBeFalsy()
    })

    it('al tocarlo debería aparecer el error', () => {
      testControl.markAsTouched()
      testControl.setValue("")
      fixture.detectChanges()


      const errores = getMensajesDeErrorPara(fixture, component.fieldName)

      const mensajeError = getMensajeDeErrorDeTipo(errores, "required")
      expect(mensajeError.nativeElement.textContent.trim()).toBe("Debe ingresar email")
    })

    describe('que tambien valida que sea un email valido', () => {
      beforeEach(() => {
        component.control.addValidators(Validators.email)
        fixture.detectChanges()
      })

      it('sin interactuar no muestra nada', () => {
        fixture.detectChanges()
        expect(getMensajesDeErrorPara(fixture, component.fieldName)).toBeFalsy()
      })

      it('al tocarlo sin alterarlo, debería aparecer el error de requerido', () => {
        testControl.markAsTouched()
        testControl.setValue("")
        fixture.detectChanges()


        const errores = getMensajesDeErrorPara(fixture, component.fieldName)
        expect(cantidadDeErrores(errores)).toBe(1)

        const mensajeError = getMensajeDeErrorDeTipo(errores, "required")
        expect(mensajeError.nativeElement.textContent.trim()).toBe("Debe ingresar email")
      })

      it('al ingresar algo que no es un mail, da el error genérico', () => {
        testControl.markAsTouched()
        testControl.setValue("mailNoValido")
        fixture.detectChanges()


        const errores = getMensajesDeErrorPara(fixture, component.fieldName)
        expect(cantidadDeErrores(errores)).toBe(1)

        const mensajeError = getMensajeDeErrorDeTipo(errores, "email")
        expect(mensajeError.nativeElement.textContent.trim()).toBe(`Hay un error con el campo ${component.fieldName}: email`)
      })
    })
  })

})

// describe('para un campo requerido', () >= {
//
//
//   it('para un campo requerido debería mostrar un error de requerido', () => {
//   component.control.addValidators(Validators.required)
//   fixture.detectChanges()
//   expect(mensajeDeError(fixture, component.fieldName)).toBeFalsy()
// })
//
// it('para un campo requerido debería mostrar un error de requerido', () => {
//   component.control.addValidators(Validators.required)
//   fixture.detectChanges()
//   expect(mensajeDeError(fixture, component.fieldName)).toBeFalsy()
// })
// })

const getByTestId = (appComponent: ComponentFixture<unknown>, testId: string) => {
  const compiled = appComponent.debugElement.nativeElement
  return compiled.querySelector(`[data-testid="${testId}"]`)
}

const getMensajesDeErrorPara = (fixture: ComponentFixture<unknown>, field: string) => {
  return fixture.debugElement.query(By.css(`[data-testid="errors-${field}"]`))
}
const cantidadDeErrores = (errores: DebugElement) => {
  return errores.queryAll(By.css(`.validation`)).length
}

const getMensajeDeErrorDeTipo = (debugElement: DebugElement, validator: string) => {
  return debugElement.query(By.css(`[data-testid="errorMessage-${validator}"]`))
}

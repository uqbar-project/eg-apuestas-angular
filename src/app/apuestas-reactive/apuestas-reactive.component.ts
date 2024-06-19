import { Component } from '@angular/core'
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import dayjs from 'dayjs'
import { Apuesta, MONTO_MINIMO_PLENO } from 'app/domain/apuesta'
import { ValidationErrorMessageComponent } from './validation-error-message/validation-error-message.component'

@Component({
  selector: 'app-apuestas-reactive',
  standalone: true,
  imports: [ReactiveFormsModule, ValidationErrorMessageComponent],
  templateUrl: './apuestas-reactive.component.html',
  styleUrl: './apuestas-reactive.component.css'
})
export class ApuestasReactiveComponent {
  // El formulario agrupa
  // - campos (fields) que ingresa el usuario, pero también
  // - valores como el resultado
  apuestaForm = this.formBuilder.group({
    fecha: ['', [Validators.required, DateValidator.equalOrGreaterThanToday]],
    monto: ['', [Validators.required, Validators.min(MONTO_MINIMO_PLENO + 1)]],
    valorApostado: [1, [Validators.required]],
    resultado: ['']
  })

  constructor(private formBuilder: FormBuilder) {}

  apuesta = new Apuesta()

  getFormControl(field: string) {
    const control = this.apuestaForm.get(field)
    return <FormControl>control
  }

  apostar() {
    // otra alternativa: https://docs.rxweb.io/getting-started

    // antes que nada, validamos posibles erroresApuesta, y de existir los hacemos visibles "tocándolos".
    if (this.apuestaForm.invalid) {
      this.apuestaForm.markAllAsTouched()
      return
    }

    // reutilizamos el objeto apuesta
    const campoFecha = this.apuestaForm.get('fecha')?.value
    this.apuesta = Object.assign(
      this.apuesta,
      { ...this.apuestaForm.value },
      { fecha: campoFecha ? dayjs(campoFecha).toDate() : undefined }
    )
    this.apuesta.apostar()

    const erroresApuesta = this.apuesta.getAllErrors()
    if (erroresApuesta.length) return

    // sin el binding necesitamos hacer las transformaciones a mano
    this.apuestaForm
      .get('resultado')!
      .setValue(this.apuesta.resultado?.valor() ?? null)
  }

  resultado() {
    return this.apuestaForm.get('resultado')?.value ?? undefined
  }
}

export class DateValidator {
  static equalOrGreaterThanToday(control: AbstractControl) {
    const value = control.value
    if (value === null || value === '') return null

    const pickedDate = dayjs(value).toDate()
    const now = new Date()
    pickedDate.setHours(0,0,0,0)
    now.setHours(0,0,0,0)

    if (pickedDate < now)
      return { dateShouldBeEqualOrGreaterThanToday: { message: 'Debe ingresar fecha de hoy o futura' } }

    return null
  }
}

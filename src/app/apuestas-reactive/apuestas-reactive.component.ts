import { Component } from '@angular/core'
import { AbstractControl, FormBuilder, Validators } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import dayjs from 'dayjs'
import { Apuesta, MONTO_MINIMO_PLENO } from 'app/domain/apuesta'

@Component({
  selector: 'app-apuestas-reactive',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './apuestas-reactive.component.html',
  styleUrl: './apuestas-reactive.component.css'
})
export class ApuestasReactiveComponent {
  // El formulario agrupa
  // - campos (fields) que ingresa el usuario, pero también
  // - valores como el resultado
  apuestaForm = this.formBuilder.group({
    fecha: ['', [
        DateValidator.greaterThanToday
      ]
    ],
    monto: [0, [
        Validators.required,
        Validators.min(MONTO_MINIMO_PLENO),
      ]
    ],
    valorApostado: [1,
      [
        Validators.required,
      ]
    ],
  })

  constructor(private formBuilder: FormBuilder) {}

  apuesta = new Apuesta()

  errorMessage(field: string, validator: string) {
    const error = this.apuestaForm.get(field)?.errors
    if (validator === 'required' && error) return `Debe ingresar ${field}`
    if (validator === 'min' && error) return `Debe ingresar un valor mayor a ${error['min']['min']} para ${field}`
    return error?.[validator]?.message ?? undefined
  }

  apostar() {
    // otra alternativa: https://docs.rxweb.io/getting-started

    // reutilizamos el objeto apuesta
    const fecha = this.apuestaForm.get('fecha')?.value
    this.apuesta = Object.assign(
      this.apuesta,
      { ...this.apuestaForm.value },
      { fecha: fecha ? dayjs(fecha).toDate() : undefined },
    )
    this.apuesta.apostar()
  }
}

export class DateValidator {
  static greaterThanToday(control: AbstractControl) {
    const value = control.value
    if (value === null || value === '') return { dateShouldBeGreaterThanToday: { message: 'Debe ingresar fecha' } }

    const date = dayjs(value).toDate()
    return date < new Date() ? { dateShouldBeGreaterThanToday: { message: 'Debe ingresar fecha de hoy o futura' } } : null
  }
}

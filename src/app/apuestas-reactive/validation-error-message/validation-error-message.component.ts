import { Component, Input } from '@angular/core'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'validation-error-message',
  standalone: true,
  imports: [],
  templateUrl: './validation-error-message.component.html',
  styleUrl: './validation-error-message.component.css'
})
export class ValidationErrorMessageComponent {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() control !: FormControl<any>
  @Input() fieldName !: string


  tieneErrores() {
    return this.control.errors && this.control.touched
  }

  getListaErrores() {
    const errors = this.control.errors
    if (errors == null) return []
    return Object.keys(errors)
  }

  getMensajeError(validator: string) {
    const errors = this.control.errors! // Solo debería llegar acá si esto existe

    if (validator === 'required') return `Debe ingresar ${this.fieldName}`
    if (validator === 'min') return `Debe ingresar un valor mayor para ${this.fieldName}`
    return errors[validator].message ?? `Hay un error con el campo ${this.fieldName}: ${validator}`
  }
}

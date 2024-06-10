import { Component } from '@angular/core'
import { Apuesta, DOCENA, PLENO } from './apuesta'
import { ValidationFieldComponent } from './validationField/validationField.component'
import { FormsModule } from '@angular/forms'
import dayjs from 'dayjs'

@Component({
  selector: 'app-apuestas-binding',
  standalone: true,
  imports: [FormsModule, ValidationFieldComponent],
  templateUrl: './apuestas-binding.component.html',
  styleUrl: './apuestas-binding.component.css'
})
export class ApuestasBindingComponent {
  apuesta = new Apuesta()
  fechaApuesta = ''
  tiposApuesta = [PLENO, DOCENA]
  cssClass = 'fecha'

  apostar() {
    // con el template no hay demasiada lógica en nuestro modelo de vista
    this.apuesta.fecha = this.fechaApuesta === '' ? undefined : dayjs(this.fechaApuesta).toDate()
    this.apuesta.apostar()
  }

}

import { Component } from '@angular/core'
import { Apuesta, DOCENA, PLENO } from './apuesta'
import { ValidationFieldComponent } from './validationField/validationField.component'
import { FormsModule } from '@angular/forms'
import dayjs from 'dayjs'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-apuestas-binding',
  standalone: true,
  imports: [DatePipe, FormsModule, ValidationFieldComponent],
  templateUrl: './apuestas-binding.component.html',
  styleUrl: './apuestas-binding.component.css'
})
export class ApuestasBindingComponent {
  apuesta = new Apuesta()
  fechaApuesta = ''
  fechaApuestaMinima = new Date()
  tiposApuesta = [PLENO, DOCENA]
  cssClass = 'fecha'

  apostar() {
    // con el template no hay demasiada lógica en nuestro modelo de vista
    this.apuesta.fecha = this.fechaApuesta === '' ? undefined : dayjs(this.fechaApuesta).toDate()
    this.apuesta.apostar()
  }

}

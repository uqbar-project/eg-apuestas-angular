import { Apuesta } from './../apuesta'
import { Component, Input } from '@angular/core'

@Component({
  selector: 'validation-field',
  templateUrl: './validationField.component.html',
  styleUrls: ['./validationField.component.css'],
  standalone: true,
})
export class ValidationFieldComponent {
  @Input() apuesta!: Apuesta
  @Input() field!: string
}

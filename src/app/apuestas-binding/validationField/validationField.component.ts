import { Component, Input } from '@angular/core'

@Component({
  selector: 'validation-field',
  templateUrl: './validationField.component.html',
  styleUrls: ['./validationField.component.css'],
  standalone: true,
})
export class ValidationFieldComponent {
  @Input() domainElement!: DomainElement
  @Input() field!:string
}

export type DomainElement = {
  errorsFrom(field: string): string
  hasErrors(field: string): boolean
}
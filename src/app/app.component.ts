import { Component, OnInit } from '@angular/core'
import { Apuesta, Pleno, Docena } from './apuesta'
import { Resultado } from './resultado'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app'
  apuesta = new Apuesta()
  opcionesFecha: {}
  fechaModel : any = {}
  tiposApuesta = [Apuesta.PLENO, Apuesta.DOCENA]
  errorMessage = ""

  apostar() {
    try {
      this.apuesta.fecha = this.convertirADate(this.fechaModel)
      this.errorMessage = ""
      this.apuesta.apostar()
    } catch (errorValidation) {
      this.errorMessage = errorValidation
    }
  }

  ngOnInit() {
    const ayer = new Date()
    ayer.setDate(ayer.getDate() - 1)
    this.opcionesFecha = {
      dateFormat: 'dd/mm/yyyy', disableUntil: this.convertirANuevoDate(ayer)
    }
    const fechaApuesta = this.apuesta.fecha
    this.fechaModel = {
      date: this.convertirANuevoDate(fechaApuesta)
    }
  }

  convertirANuevoDate(fecha: Date) {
    return {
      year: fecha.getFullYear(),
      month: fecha.getMonth() + 1,
      day: fecha.getDate()
    }
  }

  convertirADate(fecha: any): Date {
    if (!fecha) return null
    return new Date(fecha.year, fecha.month - 1, fecha.day)
  }
}

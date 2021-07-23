import { Component, OnInit } from '@angular/core'
import { faCalendar, faCalendarTimes } from '@fortawesome/free-solid-svg-icons'
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker'

import { Apuesta, DOCENA, PLENO } from './apuesta'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app'
  apuesta = new Apuesta()
  opcionesFecha!: IAngularMyDpOptions
  tiposApuesta = [PLENO, DOCENA]
  errorMessage = ''
  faCalendar = faCalendar
  faCalendarTimes = faCalendarTimes

  apostar() {
    try {
      this.errorMessage = ''
      this.apuesta.apostar()
    } catch (errorValidation) {
      this.errorMessage = errorValidation
    }
  }

  ngOnInit() {
    const ayer = new Date()
    ayer.setDate(ayer.getDate() - 1)
    this.opcionesFecha = {
      dateFormat: 'dd/mm/yyyy',
      disableUntil: this.dateToJson(ayer),
      dateRange: false,
    }
  }

  dateToJson(fecha: Date) {
    return {
      year: fecha.getFullYear(),
      month: fecha.getMonth() + 1,
      day: fecha.getDate()
    }
  }

  dateSelected(event: IMyDateModel): void {
    this.apuesta.fecha = event.singleDate?.jsDate
  }
}

import { Component, OnInit } from '@angular/core'

import { Apuesta, DOCENA, PLENO } from './apuesta'
import { IDatePickerConfig, ISelectionEvent } from 'ng2-date-picker'
import * as dayjs from 'dayjs'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  apuesta = new Apuesta()
  opcionesFecha!: IDatePickerConfig
  tiposApuesta = [PLENO, DOCENA]
  cssClass = "fecha"

  apostar() {
    this.apuesta.apostar()
  }

  dateSelected(event: ISelectionEvent) {
    this.apuesta.fecha = dayjs(event.date).toDate()
  }

  ngOnInit() {
    this.opcionesFecha = {
      min: dayjs(new Date()),
      format: 'DD/MM/YYYY',
    }
  }

}

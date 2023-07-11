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
  fechaApostada: any
  tiposApuesta = [PLENO, DOCENA]
  cssClass = "fecha"

  apostar() {
    console.info('aposta', this.fechaApostada)
    this.apuesta.fecha = this.fechaApostada.$d

    this.apuesta.apostar()
  }

  ngOnInit() {
    this.opcionesFecha = {
      min: dayjs(new Date()),
      format: 'DD/MM/YYYY',
    }
  }

}

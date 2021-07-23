import { Resultado } from './resultado'

export class Pleno {
  ganancia = 35
  descripcion = 'Pleno'
  valoresAApostar = Array.from(new Array(36), (value, index) => index + 1)

  validar(apuesta: Apuesta) {
    if (apuesta.monto <= 10) {
      throw 'Debe apostar más de 10 $'
    }
  }

  esGanador(numeroGanador: number, valorApostado: number) {
    return numeroGanador === valorApostado
  }
}

export class Docena {
  ganancia = 11
  descripcion = 'Docena'
  valoresAApostar = ['Primera', 'Segunda', 'Tercera']

  validar(apuesta: Apuesta) {
    if (apuesta.monto <= 50) {
      throw 'Debe apostar más de 50 $'
    }
  }

  esGanador(numeroGanador: number, valorApostado: string) {
    const docena = this.valoresAApostar.indexOf(valorApostado)
    const min = docena * 12 + 1
    const max = (docena + 1) * 12
    return numeroGanador >= min && numeroGanador <= max
  }
}

export type TipoApuesta = {
  esGanador(numeroGanador: number, valorApostado: number | string): boolean
  validar(apuesta: Apuesta): void
  get ganancia(): number
  get valoresAApostar(): (number | string)[]
}

export const PLENO = new Pleno()
export const DOCENA = new Docena()

export class Apuesta {
  fecha: Date | undefined
  monto = 0
  tipoApuesta: TipoApuesta | undefined = PLENO
  valorApostado!: string | number
  resultado: Resultado | null = null

  validarApuesta() {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    if (!this.fecha) {
      throw 'Debe ingresar una fecha de apuesta'
    }
    if (now.getTime() > this.fecha.getTime()) {
      throw 'Debe ingresar una fecha actual o posterior al día de hoy'
    }
    if (this.monto <= 0) {
      throw 'El monto a apostar debe ser positivo'
    }
    if (!this.tipoApuesta) {
      throw 'Debe ingresar tipo de apuesta'
    }
    if (!this.valorApostado) {
      throw 'Debe ingresar valor a apostar'
    }
    this.tipoApuesta.validar(this)
  }

  apostar() {
    this.resultado = null
    this.validarApuesta()
    const numeroGanador = this.obtenerNumeroGanador()
    const ganancia = this.calcularGanancia(numeroGanador)
    this.resultado = new Resultado(numeroGanador, ganancia)
  }

  obtenerNumeroGanador() {
    return Math.floor(Math.random() * 37)
  }

  calcularGanancia(numeroGanador: number) {
    return (this.tipoApuesta?.esGanador(numeroGanador, this.valorApostado)) ?
      this.monto * this.tipoApuesta.ganancia : 0
  }
}

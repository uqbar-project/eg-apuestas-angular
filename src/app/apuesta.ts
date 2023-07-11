import { Resultado } from './resultado'

export class Pleno {
  ganancia = 35
  descripcion = 'Pleno'
  valoresAApostar = Array.from(new Array(36), (value, index) => index + 1)

  validar(apuesta: Apuesta) {
    if (apuesta.monto <= 10) {
      apuesta.addError('monto', 'Debe apostar más de 10 $')
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
      apuesta.addError('monto', 'Debe apostar más de 50 $')
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

export class ValidationMessage {
  constructor(public field: string, public message: string) {}
}

export class Apuesta {
  fecha: Date | undefined
  monto = 0
  tipoApuesta: TipoApuesta | undefined = PLENO
  valorApostado!: string | number
  resultado: Resultado | null = null
  errors: ValidationMessage[] = []

  hasErrors(field: string): boolean {
    return this.errors.some((_) => _.field == field)
  }

  errorsFrom(field: string) {
    return this.errors.filter((_) => _.field == field).map((_) => _.message).join(". ")
  }


  addError(field: string, message: string) {
    this.errors.push(new ValidationMessage(field, message))
  }

  validarApuesta() {
    this.errors.length = 0 // TODO: add a helper function
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    console.info('fecha', this.fecha);
    if (!this.fecha) {
      this.addError('fecha', 'Debe ingresar una fecha de apuesta')
    } else {
      if (now.getTime() > this.fecha.getTime()) {
        this.addError('fecha', 'Debe ingresar una fecha actual o posterior al día de hoy')
      }
    }
    if (this.monto <= 0) {
      this.addError('monto', 'El monto a apostar debe ser positivo')
    }
    if (!this.tipoApuesta) {
      this.addError('tipoApuesta', 'Debe ingresar tipo de apuesta')
    } else {
      this.tipoApuesta.validar(this)
    }
    if (!this.valorApostado) {
      this.addError('valorAApostar', 'Debe ingresar valor a apostar')
    }
  }

  apostar() {
    this.resultado = null
    this.validarApuesta()
    if (this.errors.length > 0) return
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

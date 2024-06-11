export class Resultado {

    numeroGanador : number
    montoAGanar : number
    
    constructor(numeroGanador: number, montoAGanar: number) {
        this.numeroGanador = numeroGanador
        this.montoAGanar = montoAGanar
    }

    gano() {
        return this.montoAGanar > 0
    }

    valor() {
        if (this.gano()) {
            return '¡¡ Ganaste $' + this.montoAGanar + " !!"
        } else {
            return '¡¡Perdiste!! Salió el ' + this.numeroGanador
        }
    }

}
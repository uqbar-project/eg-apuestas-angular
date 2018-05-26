export class Resultado {

    numeroGanador : number
    montoAGanar : number
    
    constructor(numeroGanador, montoAGanar) {
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
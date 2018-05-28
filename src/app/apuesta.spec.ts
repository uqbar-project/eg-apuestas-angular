import { async } from '@angular/core/testing'
import { Apuesta } from './apuesta'

let apuestaOk : Apuesta

describe('Apuesta', () => {
    beforeEach(async(() => {
        apuestaOk = new Apuesta()
        apuestaOk.monto = 60
        apuestaOk.tipoApuesta = Apuesta.PLENO
        apuestaOk.valorApostado = 3
    }))
    it('apuesta valida pasa validaciones ok', async(() => {
        apuestaOk.validarApuesta()
    }))
    it('apuesta sin fecha tira error', async(() => {
        const apuestaSinFecha = new Apuesta()
        apuestaSinFecha.fecha = null
        expect(() => apuestaSinFecha.validarApuesta()).toThrow("Debe ingresar una fecha de apuesta")
    }))
    it('apuesta con monto negativo tira error', async(() => {
        const apuestaMontoNegativo = new Apuesta()
        apuestaMontoNegativo.monto = -20
        expect(() => apuestaMontoNegativo.validarApuesta()).toThrow("El monto a apostar debe ser positivo")
    }))
    it('apuesta sin tipo de apuesta tira error', async(() => {
        const apuestaSinTipoApuesta = new Apuesta()
        apuestaSinTipoApuesta.monto = 40
        apuestaSinTipoApuesta.tipoApuesta = null
        expect(() => apuestaSinTipoApuesta.validarApuesta()).toThrow("Debe ingresar tipo de apuesta")
    }))
    it('apuesta sin valor apostado tira error', async(() => {
        const apuestaSinValorApostado = new Apuesta()
        apuestaSinValorApostado.monto = 5
        apuestaSinValorApostado.tipoApuesta = Apuesta.PLENO
        expect(() => apuestaSinValorApostado.validarApuesta()).toThrow("Debe ingresar valor a apostar")
    }))
    it('apuesta pleno con poco monto tira error', async(() => {
        const apuestaPleno = new Apuesta()
        apuestaPleno.monto = 5
        apuestaPleno.tipoApuesta = Apuesta.PLENO
        apuestaPleno.valorApostado = 2
        expect(() => apuestaPleno.validarApuesta()).toThrow("Debe apostar más de 10 $")
    }))
})
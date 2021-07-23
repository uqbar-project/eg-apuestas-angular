import { Apuesta, DOCENA, PLENO } from './apuesta'

describe('Apuesta', () => {
  it('apuesta valida pasa validaciones ok', () => {
    const apuestaOk = new Apuesta()
    apuestaOk.fecha = new Date()
    apuestaOk.monto = 60
    apuestaOk.tipoApuesta = PLENO
    apuestaOk.valorApostado = 3
    apuestaOk.validarApuesta()
    expect(true).toBeTruthy()
  })
  it('apuesta sin fecha tira error', () => {
    const apuestaSinFecha = new Apuesta()
    expect(() => apuestaSinFecha.validarApuesta()).toThrow("Debe ingresar una fecha de apuesta")
  })
  it('apuesta con monto negativo tira error', () => {
    const apuestaMontoNegativo = new Apuesta()
    apuestaMontoNegativo.fecha = new Date()
    apuestaMontoNegativo.monto = -20
    expect(() => apuestaMontoNegativo.validarApuesta()).toThrow("El monto a apostar debe ser positivo")
  })
  it('apuesta sin tipo de apuesta tira error', () => {
    const apuestaSinTipoApuesta = new Apuesta()
    apuestaSinTipoApuesta.fecha = new Date()
    apuestaSinTipoApuesta.monto = 40
    apuestaSinTipoApuesta.tipoApuesta = undefined
    expect(() => apuestaSinTipoApuesta.validarApuesta()).toThrow("Debe ingresar tipo de apuesta")
  })
  it('apuesta sin valor apostado tira error', () => {
    const apuestaSinValorApostado = new Apuesta()
    apuestaSinValorApostado.fecha = new Date()
    apuestaSinValorApostado.monto = 5
    apuestaSinValorApostado.tipoApuesta = PLENO
    expect(() => apuestaSinValorApostado.validarApuesta()).toThrow("Debe ingresar valor a apostar")
  })
  it('apuesta pleno con poco monto tira error', () => {
    const apuestaPleno = new Apuesta()
    apuestaPleno.fecha = new Date()
    apuestaPleno.monto = 10
    apuestaPleno.tipoApuesta = PLENO
    apuestaPleno.valorApostado = 2
    expect(() => apuestaPleno.validarApuesta()).toThrow("Debe apostar más de 10 $")
  })
  it('apuesta docena con poco monto tira error', () => {
    const apuestaPleno = new Apuesta()
    apuestaPleno.fecha = new Date()
    apuestaPleno.monto = 50
    apuestaPleno.tipoApuesta = DOCENA
    apuestaPleno.valorApostado = 2
    expect(() => apuestaPleno.validarApuesta()).toThrow("Debe apostar más de 50 $")
  })
})
## Presentamos el ejercicio

### Resolvemos el binding

- la fecha de apuesta va contra "fechaApuesta" -> por qué lo hacemos? porque hay que convertir string a Date de js
- el monto: contra "apuesta.monto"
- necesitamos para eso que el modelo de la vista nos de una fecha como string y una apuesta:

```ts
  apuesta = new Apuesta()
  fechaApuesta = ''
  fechaApuestaMinima = new Date()
```

Mostramos un poco la apuesta, que delega en un strategy las validaciones adicionales de una apuesta y dado un número saber si ganó o no.
Dado que los strategies son stateless no necesitamos tener n objetos, trabajamos con singletons exportando como constantes dichos singletons.
También es interesante ver la parte de errores, más adelante.

- apuesta -> [(ngModel)]="apuesta.tipoApuesta" ...
- para traer los tipos de apuesta usamos un @for

```tsx
        @for (tipo of tiposApuesta; track tipo) {
            <option [ngValue]="tipo">{{tipo.descripcion}}</option>
        }
```

tiposApuesta me lo da el controller

```ts
  tiposApuesta = [PLENO, DOCENA]
```

- ...y vemos que el tipo de apuesta está relacionado con la apuesta en conjunto

```tsx
        @for (valor of apuesta.tipoApuesta?.valoresAApostar; track valor) {
            <option [ngValue]="valor">{{valor}}</option>
        }
```

- el binding es contra otra propiedad de la apuesta -> `[(ngModel)]="apuesta.valorApostado"`

### ¿Cómo hacemos que solo se pueda cargar fecha del día o posterior?

En el control de fecha

```tsx
min="{{fechaApuestaMinima  | date: 'yyyy-MM-dd'}}"
```

### Cuando cambio el tipo de apuesta me queda seleccionada la apuesta anterior

Por ejemplo si paso de Docena a Pleno, me queda Primera seleccionada. Para evitar eso agregamos esta propiedad en el combo:

```tsx
(ngModelChange)="apuesta.valorApostado = ''"
```

### Queremos que no sea posible seleccionar una apuesta si no hay tipo

En el dropdown de apuesta hacemos:

```tsx
[disabled]="!apuesta.tipoApuesta?.valoresAApostar"
```

### Ok, queremos apostar

En el botón hay que hacer

```tsx
(click)="apostar()" 
```

Y delegamos al objeto apuesta:

```ts
  apostar() {
    // con el template no hay demasiada lógica en nuestro modelo de vista
    this.apuesta.fecha = this.fechaApuesta === '' ? undefined : dayjs(this.fechaApuesta).toDate()
    this.apuesta.apostar()
  }
```

Podemos mostrar un console.info del resultado

### Cómo mostramos el resultado

En nuestro html hacemos un renderizado condicional:

```html
        @if (apuesta.resultado) {
            <div class="message" data-testid="resultado">
              {{apuesta.resultado.valor()}}
            </div>
        }
```

### Qué pasa si hay validaciones que no pasan?

Podríamos tirar excepciones, o mejor, que el dominio levante todos los errores y que la UI se encargue de mostrarlo.
Los errores se modelan como ValidationMessage:
- el nombre del campo en el formulario
- un mensaje de error, podría ser una lista de errores

Eso facilita crear un componente que filtra los errores de un form field:

```html
@if (apuesta.hasErrors(field)) {
  <div class="validation-row">
    <div [attr.data-testid]="'errorMessage-' + field" class="validation">
      {{apuesta.errorsFrom(field)}}
    </div>
  </div>
}
```

```ts
import { Component, Input } from '@angular/core'
import { Apuesta } from 'app/domain/apuesta'

@Component({
  selector: 'validation-field',
  templateUrl: './validationField.component.html',
  styleUrls: ['./validationField.component.css'],
  standalone: true,
})
export class ValidationFieldComponent {
  @Input() apuesta!: Apuesta
  @Input() field!: string
}
```

- y lo llamamos desde el componente

```html
      <validation-field [apuesta]="apuesta" [field]="'fecha'"></validation-field>
      <validation-field [apuesta]="apuesta" [field]="'monto'"></validation-field>
      <validation-field [apuesta]="apuesta" [field]="'tipoApuesta'"></validation-field>
      <validation-field [apuesta]="apuesta" [field]="'valorAApostar'"></validation-field>
```

La apuesta tiene mensajes que podrían no estar atados a ella, como errorsFrom o hasError. 
Podría haber un objeto que sea el contenedor de errores, de manera de
pasarle `apuesta.validaciones`

### Tests de front

Lo más destacable es que 

- hay tests de dominio que validan la apuesta pero el test de front es más de integración
- utilizamos spyOn de Jest para simular que la apuesta devuelve el número que queremos, tanto para ganar como para perder

```ts
it('should fail if no date is entered', () => {
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()
    expect(mensajeDeError(fixture, 'fecha')).toContain('Debe ingresar una fecha de apuesta')
  })
  it('should fail if previous date is entered', () => {
    component.fechaApuesta = '01/01/1900'
    component.apuesta = new Apuesta()
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()
    expect(mensajeDeError(fixture, 'fecha')).toContain('Debe ingresar una fecha actual o posterior al día de hoy')
  })
  it('should fail if negative amount is entered', () => {
    apostarHoy(component)
    component.apuesta = Object.assign(
      new Apuesta(),
      {
        fecha: new Date(),
        monto: -10,
      }
    )
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()
    expect(mensajeDeError(fixture, 'monto')).toContain('El monto a apostar debe ser positivo')
  })
  it('should pass all validations and inform if user wins - single', () => {
    apostarHoy(component)
    component.apuesta = apostarAl(PLENO, 25)

    spyOn(component.apuesta, 'obtenerNumeroGanador').and.returnValue(25)
    // se podría hacer a mano pero hay que deshacer esto al final del test
    // o produciría efecto colateral => el número ganador sería siempre 24
    // component.apuesta.obtenerNumeroGanador = () => 25
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()

    expect(resultado(fixture)).toContain('Ganaste $700')
  })
  it('should pass all validations and inform if user loses - single', () => {
    apostarHoy(component)
    component.apuesta = apostarAl(PLENO, 25)
    spyOn(component.apuesta, 'obtenerNumeroGanador').and.returnValue(24)
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()

    expect(resultado(fixture)).toContain('¡¡Perdiste!! Salió el 24')
  })
  it('should pass all validations and inform if user wins - dozen', () => {
    apostarHoy(component)
    component.apuesta = apostarAl(DOCENA, 'Primera', 100)
    spyOn(component.apuesta, 'obtenerNumeroGanador').and.returnValue(1)
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()

    expect(resultado(fixture)).toContain('Ganaste $1100')
  })
  it('should pass all validations and inform if user loses - dozen', () => {
    apostarHoy(component)
    component.apuesta = apostarAl(DOCENA, 'Segunda', 100)
    spyOn(component.apuesta, 'obtenerNumeroGanador').and.returnValue(1)
    getByTestId(fixture, 'btnApuesta').click()
    fixture.detectChanges()

    expect(resultado(fixture)).toContain('¡¡Perdiste!! Salió el 1')
  })
```
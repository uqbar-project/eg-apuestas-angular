
## Script reactive forms

Esta variante no usa el binding tradicional. Para eso

### Necesitamos Form Group como formulario que agrupa campos

En el `<form>` definimos

```tsx
clrForm [formGroup]="apuestaForm"
```

### Cada field tiene su nombre para poder ser referenciado en el modelo de la vista

En el html asignamos un nombre para cada field:

- formControlName="fecha" 
- formControlName="monto"
- el dropdown de tipo de apuesta acá está hardcodeado a pleno para que el ejemplo no se extienda
- formControlName="valorApostado"

El dropdown de valor apostado no cambia mucho de la variante con binding:

```tsx
        @for (valor of apuesta.tipoApuesta?.valoresAApostar; track valor) {
            <option [ngValue]="valor">{{valor}}</option>
        }
```

### Definiendo el form group en el modelo de la vista

Mediante un FormBuilder construimos la asociación con la vista:

```ts
  // El formulario agrupa
  // - campos (fields) que ingresa el usuario, pero también
  // - valores como el resultado
  apuestaForm = this.formBuilder.group({
    fecha: ['', [
        Validators.required
      ]
    ],
    monto: ['', [
        Validators.required,
        Validators.min(MONTO_MINIMO_PLENO),
      ]
    ],
    valorApostado: [1,
      [
        Validators.required,
      ]
    ],
  })
```

Fíjense que cada control define

- un valor por defecto
- eso también lo tipa -> para fecha es un string, para valor apostado un número (por qué para monto es un string?)
- y puedo escribir validadores (por ejemplo para el monto valido que sea el mínimo que el pleno necesita)
- agregamos un resultado para 


### Ahora sí, queremos apostar

Agregamos el evento onClick en el botón:

```tsx
(click)="apostar()"
```

```ts
  apostar() {
    // otra alternativa: https://docs.rxweb.io/getting-started

    // reutilizamos el objeto apuesta
    const fecha = this.apuestaForm.get('fecha')?.value
    this.apuesta = Object.assign(
      this.apuesta,
      { ...this.apuestaForm.value },
      { fecha: fecha ? dayjs(fecha).toDate() : undefined },
    )
    this.apuesta.apostar()

    console.info(this.apuesta.resultado?.valor)
  }
```

Mostramos en consola el apostar.

### Viendo el resultado de la apuesta en la página

Incorporemos un campo nuevo a nuestro form:

```ts
    valorApostado: [1,
      [
        Validators.required,
      ]
    ],
    resultado: ['']
```

Ese resultado lo vamos a asignar una vez que hayamos delegado en la apuesta, en lugar de usar el console.info:

```ts
    ...

    this.apuesta.apostar()

    // sin el binding necesitamos hacer las transformaciones a mano
    this.apuestaForm.get('resultado')!.setValue(this.apuesta.resultado?.valor() ?? null)
```

Y ahora solo falta que el formulario tenga el nuevo campo:

```html
<div class="row">
    @if (resultado()) {
        <div class="message" data-testid="resultado">
          {{resultado()}}
        </div>
    }
</div>
```

La función resultado es simplemente obtener el valor del form field:

```ts
  resultado() {
    return this.apuestaForm.get('resultado')?.value ?? undefined
  }
```

### Agregando las validaciones en pantalla

Vamos a agregar un renderizado condicional para mostrar errores, sin usar un componente específico esta vez:

```html
    @if (errorMessage('fecha', 'dateShouldBeGreaterThanToday')) {
      <div class="validation-row">
        <div [attr.data-testid]="'errorMessage-fecha'" class="validation">
          {{errorMessage('fecha', 'dateShouldBeGreaterThanToday')}}
        </div>
      </div>
    }
    ...
    @if (errorMessage('monto', 'min')) {
      <div class="validation-row">
        <div [attr.data-testid]="'errorMessage-monto'" class="validation">
          {{errorMessage('monto', 'min')}}
        </div>
      </div>
    }
    ...
    @if (errorMessage('valorApostado', 'required')) {
        <div class="validation-row">
          <div [attr.data-testid]="'errorMessage-valorApostado'" class="validation">
            {{errorMessage('valorApostado', 'required')}}
          </div>
        </div>
    }
```

La función que obtiene un mensaje de error es parecida a la de la implementación anterior:

```ts
  errorMessage(field: string, validator: string) {
    const error = this.apuestaForm.get(field)?.errors
    if (validator === 'required' && error) return `Debe ingresar ${field}`
    if (validator === 'min' && error) return `Debe ingresar un valor mayor para ${field}`
    return error?.[validator]?.message ?? undefined
  }
```

### Mejorando la validación de pleno

Fíjense que solo validamos que la fecha se haya cargado. Eso da una mala UX, porque si falla está saltando un error en consola.

Vamos a agregar un validador custom para tomar la fecha de hoy:

```ts
export class DateValidator {
  static greaterThanToday(control: AbstractControl) {
    const value = control.value
    if (value === null || value === '') return { dateShouldBeGreaterThanToday: { message: 'Debe ingresar fecha' } }

    const date = dayjs(value).toDate()
    return date < new Date() ? { dateShouldBeGreaterThanToday: { message: 'Debe ingresar fecha de hoy o futura' } } : null
  }
}
```

Cambiamos también el validador de nuestro form field fecha:

```ts
  apuestaForm = this.formBuilder.group({
    fecha: ['', [
      DateValidator.greaterThanToday
    ]
    ...
```

### Conclusiones

...
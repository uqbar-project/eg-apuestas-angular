
## Antes de presentar la variante reactiva...

La idea de tener un binding automático no es nueva de Angular, pero sí fue notablemente masivo desde su llegada al mercado con AngularJS (las versiones de Angular 1). No obstante, una sombra larga se posó sobre el framework: era "lento", o en todo caso, en algunos casos de uso donde había dependencia entre muchos controles, la aplicación degradaba su performance y peor aun, se tornaba impredecible (así surgió React desde las oficinas de Facebook).

Esa marca trató de borrarse a partir del relanzamiento de Angular (a secas, sin JS) cuando el framework abrazó Typescript de entrada y además decidió hacer un lanzamiento de una versión major cada 6 meses. Hay que decir que pese a esos esfuerzos por mejorar la imagen, quedó flotando en el ambiente la idea de que Angular no funcionaba tan rápido como React.

La biblioteca que se encarga de manejar el binding entre modelo y vista es "zone.js". Lamentablemente, zoneJS tiene una estrategia poco feliz para manejar los cambios:

- cualquier cambio en un componente dentro de una página, dispara una actualización de toda la jerarquía de componentes (no importa si se modificaron o no). Esto implica que si tenemos una gran cantidad de componentes, Angular puede estar reescribiendo el DOM de nuestra página web muchas veces de manera innecesaria.
- cada componente puede modificar esta estrategia mediante la configuración `changeDetection: ChangeDetectionStrategy.OnPush` y así lo que sucede es que cuando ocurre un cambio en un componente, Angular rastrea a partir de la raíz de la jerarquía buscando cambios en nuestro template para detectar si por ejemplo se debería mostrar información nueva al usuario. 

Lo raro es que no solamente el comportamiento por defecto es el que utiliza menos recursos, sino que el equipo de trabajo de Angular está trabajando para que el componente ZoneJS sea opcional, reemplazándolo por 1. signals, 2. change detector ref, que nos permite hacer llamadas específicas donde indicamos al framework que debe volver a renderizar la información del componente. 

Esta decisión tiene algunas desventajas

- no todas las páginas tienen mala performance
- ok, podemos elegir si queremos usar ZoneJS o no, pero eso implica que soportemos heterogeneidad de nuestros componentes o bien que necesitemos más líneas para lograr la misma funcionalidad que antes teníamos gratis.


Recomendamos

- [esta introducción](https://www.youtube.com/watch?v=EWtma0v-WzQ) de Carlos Morales
- y [este video](https://www.youtube.com/watch?v=lmrf_gPIOZU) de Joshua Morony que explica con más profundidad el comportamiento por debajo de Zone JS.

## Ahora sí, formularios reactivos

Angular 2 nació también con la idea de tener una alternativa a los formularios con templating (o binding) que son los **reactive forms**.

Los elementos principales de un formulario reactivo son:

- **form control**: se asocia a un control de UI (input, checkbox, dropdown), por lo tanto guardan los valores que ingresa el usuario, hacen el seguimiento de los cambios y podemos registrarle validaciones como veremos más adelante.
- **form group**: podemos agrupar varios controles para que la carga y la validación se haga en conjunto, como una dirección, la carga de datos personales, etc.

## Formulario de apuesta

Para crear un formulario utilizamos un **form builder** que permite mejorar la expresividad

```ts
  apuestaForm = this.formBuilder.group({
    fecha: ['', [
        DateValidator.greaterThanToday
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
    resultado: ['']
  })
```

El form builder se inyecta en el constructor (_constructor injection_)

```ts
constructor(private formBuilder: FormBuilder) {}
```

y el formulario agrupa los controles que se definen pasando:

- una clave que define el nombre del campo,
- y como valor
  - un valor inicial que marca también el tipo que almacenan (string para fecha, number para monto, etc.)
  - una lista de validadores que determinan si el campo es válido y adicionalmente permiten mostrar un mensaje _custom_

Cada control necesita indicar el nombre del formControl

```html
<div class="row">
  <input type="date" data-testid="fechaApuesta" id="fecha" name="fecha" formControlName="fecha" placeholder="Fecha de apuesta">
</div>
```

## Validaciones

En este caso no componentizamos la muestra de los errores de validación, simplemente delegamos la responsabilidad de mostrar el mensaje a una función específica:

```html
  @if (errorMessage('fecha', 'dateShouldBeGreaterThanToday')) {
    <div class="validation-row">
      <div [attr.data-testid]="'errorMessage-fecha'" class="validation">
        {{errorMessage('fecha', 'dateShouldBeGreaterThanToday')}}
      </div>
    </div>
  }
```

La implementación de errorMessage es una función que tiene baja cohesión, conoce todas las validaciones del formulario, y a medida que crece la cantidad de campos se vuelve más y más extenso:

```ts
errorMessage(field: string, validator: string) {
  const error = this.apuestaForm.get(field)?.errors
  if (validator === 'required' && error) return `Debe ingresar ${field}`
  if (validator === 'min' && error) return `Debe ingresar un valor mayor para ${field}`
  return error?.[validator]?.message ?? undefined
}
```

Para determinar si la fecha de apuesta es válida, definimos un validador propio:

```ts
export class DateValidator {
  // Number only validation
  static greaterThanToday(control: AbstractControl) {
    const value = control.value
    if (value === null || value === '') return { dateShouldBeGreaterThanToday: { message: 'Debe ingresar fecha' } }

    const date = dayjs(value).toDate()
    return date < new Date() ? { dateShouldBeGreaterThanToday: { message: 'Debe ingresar fecha de hoy o futura' } } : null
  }
}
```

La interfaz que define el validador de Angular es un poco rara: es un objeto con una clave para el validador y adicionalmente un mensaje específico (o un booleano que indica si el valor es correcto).

## Apostar

A la hora de definir el comportamiento del botón Apostar, aparecen algunas cuestiones

- al no haber binding, necesitamos pasar la información que está en el form control hacia el objeto apuesta, lo que puede necesitar ciertas transformaciones (como en el caso de la fecha)
- luego de la apuesta se genera un objeto Resultado, pero nuevamente no hay binding, con lo cual tenemos que **manualmente** asignar un form control que sirve para tal fin para que el usuario lo visualice

## Consecuencias

- Para evitar que el ejemplo se extienda mucho, no implementamos la combinación de dropdowns para el tipo de apuesta vs. el valor a apostar. Solo permitimos apostar a pleno
- Aun así, pasamos de 27 líneas a 77 aun con menos funcionalidades. La versión reactiva tiene menos declaratividad, y ese control trae como costo la necesidad de ser explícito con lo que queremos hacer
- Cuando la página comienza se disparan los validadores automáticamente, a diferencia de la variante con templating
- El testing no tiene diferencias con la otra variante, trabajamos con data-testid

## Links

- [Volver al README](../README.md)
- [Ver la explicación del formulario con templating](./templating.md)

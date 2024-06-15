
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

- **form control**
- **form group**
- **form builder**

## Links

- [Volver al README](../README.md)
- [Ver la explicación del formulario con templating](./templating.md)

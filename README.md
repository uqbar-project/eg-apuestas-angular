# Apuestas de una ruleta

Esta aplicación permite mostrar cómo funciona el binding bidireccional.

# Creación de la aplicación

Creamos la aplicación con Angular CLI y agregamos las dependencias de Material Design for Bootstrap y MyDatePicker para contar con un control calendario (pueden ver [la documentación oficial aquí](https://github.com/kekeh/mydatepicker/blob/master/README.md)):

```bash
$ ng new eg-apuestas-angular
$ cd eg-apuestas-angular
$ npm install mdbootstrap --save
$ npm install mydatepicker --save
```

# Arquitectura general

![images](images/Arquitectura.png)

Se desarrolló la página principal en el componente raíz original app.component, que describiremos a continuación.

# Vista principal

La vista tiene tags propios del framework Material Design for Bootstrap. El binding es bidireccional para cargar todos los datos de una apuesta: fecha, monto, tipo de apuesta y valor apostado. Cuando el formulario tiene un error se visualiza dicho error con un cartel rojo (alert-danger), y cuando el usuario decide apostar se le informa si ganó o perdió con un cartel azul (alert-info).

## Ingreso de una fecha

Para cargar la fecha manualmente y además abrir un calendario en un formulario modal, utilizamos el control myDatePicker, de la siguiente manera:

```html
    <my-date-picker name="fechaApuesta" [options]="opcionesFecha"
                    [(ngModel)]="fechaModel" required></my-date-picker>
``` 

Esto requiere hacer imports en nuestro ngModule:

```typescript
import { MyDatePickerModule, MyDatePicker } from 'mydatepicker'
...

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ...,
    MyDatePickerModule
  ],
```

## Combos anidados

Para trabajar el anidamiento de combos
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { AppComponent } from './app.component'
import { ValidationFieldComponent } from './validationField/validationField.component'
import { DpDatePickerModule } from 'ng2-date-picker'

export const importedModules = [
  BrowserModule,
  FormsModule,
  DpDatePickerModule,
  FontAwesomeModule,
]
@NgModule({
  declarations: [	
    AppComponent,
    ValidationFieldComponent,
   ],
  imports: importedModules,
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

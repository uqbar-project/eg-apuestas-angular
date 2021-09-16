import { AngularMyDatePickerModule } from 'angular-mydatepicker'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { AppComponent } from './app.component'
import { ValidationFieldComponent } from './validationField/validationField.component'

@NgModule({
  declarations: [	
    AppComponent,
    ValidationFieldComponent,
   ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularMyDatePickerModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { ComponentFixture, TestBed } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { ApuestasBindingComponent } from './apuestas-binding/apuestas-binding.component'
import { ApuestasReactiveComponent } from './apuestas-reactive/apuestas-reactive.component'
import { RouterModule } from '@angular/router'

describe('AppComponent', () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, ApuestasBindingComponent, ApuestasReactiveComponent, RouterModule.forRoot([])],
    }).compileComponents()
    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create the app', () => {
    expect(component).toBeTruthy()
  })

  it('should render two options', () => {
    const compiled = fixture.nativeElement as HTMLElement
    expect(compiled.querySelectorAll('li').length).toBe(2)
  })
})

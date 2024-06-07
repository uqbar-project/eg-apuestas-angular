import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ApuestasBindingComponent } from './apuestas-binding.component'

describe('ApuestasBindingComponent', () => {
  let component: ApuestasBindingComponent
  let fixture: ComponentFixture<ApuestasBindingComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApuestasBindingComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(ApuestasBindingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

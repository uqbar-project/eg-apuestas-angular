import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApuestasReactiveComponent } from './apuestas-reactive.component';

describe('ApuestasReactiveComponent', () => {
  let component: ApuestasReactiveComponent;
  let fixture: ComponentFixture<ApuestasReactiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApuestasReactiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApuestasReactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

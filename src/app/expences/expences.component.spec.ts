import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpencesComponent } from './expences.component';

describe('ExpencesComponent', () => {
  let component: ExpencesComponent;
  let fixture: ComponentFixture<ExpencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpencesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

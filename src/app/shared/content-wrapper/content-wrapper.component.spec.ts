import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { ContentWrapperComponent } from './content-wrapper.component';

describe('ContentWrapperComponent', () => {
  let component: ContentWrapperComponent;
  let fixture: ComponentFixture<ContentWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule],
      declarations: [ ContentWrapperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

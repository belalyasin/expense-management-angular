import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { MainSidebarComponent } from './main-sidebar.component';

describe('MainSidebarComponent', () => {
  let component: MainSidebarComponent;
  let fixture: ComponentFixture<MainSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule],
      declarations: [ MainSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

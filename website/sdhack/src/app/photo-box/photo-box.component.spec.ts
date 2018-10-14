import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoBoxComponent } from './photo-box.component';

describe('PhotoBoxComponent', () => {
  let component: PhotoBoxComponent;
  let fixture: ComponentFixture<PhotoBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

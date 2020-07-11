import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageStreetComponent } from './image-street.component';

describe('ImageStreetComponent', () => {
  let component: ImageStreetComponent;
  let fixture: ComponentFixture<ImageStreetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageStreetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageStreetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductinventoryComponent } from './productinventory.component';

describe('ProductinventoryComponent', () => {
  let component: ProductinventoryComponent;
  let fixture: ComponentFixture<ProductinventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductinventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductinventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

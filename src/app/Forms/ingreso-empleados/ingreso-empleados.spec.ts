import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoEmpleados } from './ingreso-empleados';

describe('IngresoEmpleados', () => {
  let component: IngresoEmpleados;
  let fixture: ComponentFixture<IngresoEmpleados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresoEmpleados],
    }).compileComponents();

    fixture = TestBed.createComponent(IngresoEmpleados);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

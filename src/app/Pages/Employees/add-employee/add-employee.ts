import { Component } from '@angular/core';
import { IngresoEmpleados } from '../../../Forms/ingreso-empleados/ingreso-empleados';
import { Footer } from '../../../Reutilizables/footer/footer';
import { Navbar } from '../../../Reutilizables/navbar/navbar';

@Component({
  selector: 'app-add-employee',
  imports: [Navbar, IngresoEmpleados, Footer],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css',
})
export class AddEmployee {}

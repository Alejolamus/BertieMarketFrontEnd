import { Component } from '@angular/core';
import { Footer } from '../../Reutilizables/footer/footer';
import { Navbar } from '../../Reutilizables/navbar/navbar';
import { Inicio } from '../../Reportes/inicio/inicio';

@Component({
  selector: 'app-home',
  imports: [Navbar, Inicio, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}

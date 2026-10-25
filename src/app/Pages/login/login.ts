import { Component } from '@angular/core';
import { Login as LoginForm } from '../../Forms/login/login';
import { Footer } from '../../Reutilizables/footer/footer';
import { Navbar } from '../../Reutilizables/navbar/navbar';

@Component({
  selector: 'app-login',
  imports: [Navbar, LoginForm, Footer],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}

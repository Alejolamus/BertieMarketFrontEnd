import { Routes } from '@angular/router';

import { AddEmployee } from './Pages/Employees/add-employee/add-employee';
import { Home } from './Pages/home/home';
import { Login } from './Pages/login/login';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    component: Login,
    title: 'Iniciar sesión | Bertie Market',
  },
  {
    path: 'home',
    component: Home,
    title: 'Inicio | Bertie Market',
  },
  {
    path: 'empleados',
    component: AddEmployee,
    title: 'Gestión de empleados | Bertie Market',
  },
  { path: '**', redirectTo: 'login' },
];

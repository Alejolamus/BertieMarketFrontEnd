import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

interface SesionUsuario {
  nombre: string;
  rol: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  host: {
    '(document:keydown.escape)': 'cerrarMenus()',
  },
})
export class Navbar {
  private readonly router = inject(Router);

  private readonly urlActual = toSignal(
    this.router.events.pipe(
      filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
      map((evento) => evento.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly esLogin = computed(() => {
    const url = this.urlActual();
    return url === '/' || url.startsWith('/login');
  });

  protected readonly menuMovil = signal(false);
  protected readonly menuCuenta = signal(false);
  protected readonly sesion = signal<SesionUsuario>(this.leerSesion());

  protected readonly nombreMostrado = computed(() => this.sesion().nombre || 'Usuario');
  protected readonly rolMostrado = computed(() => {
    const rol = this.sesion().rol;
    if (!rol) {
      return 'Usuario';
    }
    return rol.charAt(0).toUpperCase() + rol.slice(1).toLowerCase();
  });

  protected alternarMenuMovil(): void {
    this.menuCuenta.set(false);
    this.menuMovil.update((abierto) => !abierto);
  }

  protected alternarMenuCuenta(): void {
    this.menuMovil.set(false);
    this.menuCuenta.update((abierto) => !abierto);
  }

  protected cerrarMenus(): void {
    this.menuMovil.set(false);
    this.menuCuenta.set(false);
  }

  protected cerrarSesion(): void {
    try {
      localStorage.removeItem('RollNombre');
    } catch {
      // El almacenamiento local puede no estar disponible; la navegación continúa.
    }

    this.cerrarMenus();
    void this.router.navigate(['/login']);
  }

  private leerSesion(): SesionUsuario {
    let valor: string | null = null;

    try {
      valor = localStorage.getItem('RollNombre');
    } catch {
      valor = null;
    }

    const contenido = valor?.trim();
    if (!contenido) {
      return { nombre: 'Invitado', rol: 'Sin sesión' };
    }

    const [rol, ...resto] = contenido.split(/\s+/);
    return {
      nombre: resto.join(' ') || 'Usuario',
      rol: rol || 'Usuario',
    };
  }
}

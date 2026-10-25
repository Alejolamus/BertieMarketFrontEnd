import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * Credenciales temporales del prototipo.
 *
 * IMPORTANTE: esta validación es únicamente demostrativa y se ejecuta en el
 * navegador. Debe sustituirse por un mecanismo de autenticación seguro
 * conectado al backend antes de pasar a producción.
 */
const USUARIO_VALIDO = 'JonhR@bertie.market.co';
const CLAVE_VALIDA = '1137220jr';
const CLAVE_SESION = 'RollNombre';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  private readonly dialogoError = viewChild<ElementRef<HTMLDialogElement>>('dialogoError');

  protected readonly mostrarClave = signal(false);
  protected readonly errorCredenciales = signal(false);

  protected readonly formulario = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required]],
  });

  protected alternarClave(): void {
    this.mostrarClave.update((visible) => !visible);
  }

  protected campoInvalido(campo: 'correo' | 'clave'): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && control.touched;
  }

  protected mensajeError(campo: 'correo' | 'clave'): string {
    const control = this.formulario.controls[campo];

    if (control.hasError('required')) {
      return campo === 'correo' ? 'Ingresa tu correo electrónico.' : 'Ingresa tu contraseña.';
    }

    if (control.hasError('email')) {
      return 'Ingresa un correo electrónico válido.';
    }

    return 'Revisa este campo.';
  }

  protected iniciarSesion(): void {
    this.errorCredenciales.set(false);

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { correo, clave } = this.formulario.getRawValue();

    // Autenticación temporal del prototipo. No se almacena la contraseña.
    if (correo === USUARIO_VALIDO && clave === CLAVE_VALIDA) {
      try {
        localStorage.setItem(CLAVE_SESION, 'admin Jonh R');
      } catch {
        // Si el almacenamiento no está disponible, se permite continuar.
      }

      void this.router.navigate(['/home']);
      return;
    }

    this.errorCredenciales.set(true);
    this.abrirDialogoError();
  }

  protected cerrarDialogoError(): void {
    const dialogo = this.dialogoError()?.nativeElement;

    if (dialogo?.open) {
      dialogo.close();
    }
  }

  private abrirDialogoError(): void {
    const dialogo = this.dialogoError()?.nativeElement;

    if (dialogo && !dialogo.open && typeof dialogo.showModal === 'function') {
      dialogo.showModal();
    }
  }
}

import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

type CampoEmpleado =
  'nombres' | 'correo' | 'tipoDocumento' | 'rol' | 'numeroDocumento' | 'fechaInicio' | 'telefono';

function fechaNoPosteriorAHoy(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;

  if (!valor || typeof valor !== 'string') {
    return null;
  }

  const fecha = new Date(`${valor}T00:00:00`);
  if (Number.isNaN(fecha.getTime())) {
    return null;
  }

  const hoy = new Date();
  hoy.setHours(23, 59, 59, 999);

  return fecha.getTime() > hoy.getTime() ? { fechaFutura: true } : null;
}

function fechaHoy(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

@Component({
  selector: 'app-ingreso-empleados',
  imports: [ReactiveFormsModule],
  templateUrl: './ingreso-empleados.html',
  styleUrl: './ingreso-empleados.css',
})
export class IngresoEmpleados {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly roles = ['Admin', 'Supervisor', 'Inventario', 'Cajero'] as const;
  protected readonly tiposDocumento = [
    'Cédula de ciudadanía',
    'Cédula de extranjería',
    'Pasaporte',
    'NIT',
  ] as const;
  protected readonly fechaMaxima = fechaHoy();

  protected readonly enviado = signal(false);
  protected readonly confirmacion = signal(false);

  protected readonly formulario = this.fb.nonNullable.group({
    nombres: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.'-]+$/),
      ],
    ],
    correo: ['', [Validators.required, Validators.email]],
    tipoDocumento: ['', Validators.required],
    rol: ['', Validators.required],
    numeroDocumento: ['', [Validators.required, Validators.pattern(/^\d{6,15}$/)]],
    fechaInicio: ['', [Validators.required, fechaNoPosteriorAHoy]],
    telefono: ['', [Validators.required, Validators.pattern(/^\+?[\d\s()-]{7,20}$/)]],
  });

  constructor() {
    this.formulario.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.confirmacion()) {
        this.confirmacion.set(false);
      }
    });
  }

  protected campoInvalido(campo: CampoEmpleado): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.invalid && (control.touched || this.enviado());
  }

  protected mensajeError(campo: CampoEmpleado): string {
    const control = this.formulario.get(campo);

    if (!control?.errors) {
      return '';
    }

    if (control.hasError('required')) {
      return 'Este campo es obligatorio.';
    }

    if (control.hasError('email')) {
      return 'Ingresa un correo electrónico válido.';
    }

    if (control.hasError('fechaFutura')) {
      return 'La fecha no puede ser posterior a hoy.';
    }

    if (control.hasError('minlength')) {
      const errorLongitud = control.getError('minlength') as { requiredLength?: number } | null;
      const minimo = errorLongitud?.requiredLength ?? 3;
      return `Ingresa al menos ${minimo} caracteres.`;
    }

    if (control.hasError('pattern')) {
      switch (campo) {
        case 'nombres':
          return 'Usa solo letras, espacios, puntos o guiones.';
        case 'numeroDocumento':
          return 'Ingresa entre 6 y 15 dígitos, sin puntos ni espacios.';
        case 'telefono':
          return 'Ingresa un teléfono válido de 7 a 20 caracteres.';
        default:
          return 'El formato no es válido.';
      }
    }

    return 'Revisa este campo.';
  }

  protected guardar(): void {
    this.confirmacion.set(false);

    if (this.formulario.invalid) {
      this.enviado.set(true);
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviado.set(false);

    // Prototipo: por ahora no existe una API ni persistencia de datos.
    this.confirmacion.set(true);
  }

  protected cancelar(): void {
    this.formulario.reset();
    this.enviado.set(false);
    this.confirmacion.set(false);
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  isLoading: boolean = true;
  formularioLogin: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);

  @Output() loggedin = new EventEmitter<string>();
  @Output() exportLoggedIn = new EventEmitter<boolean>();

  formBuilder = inject(FormBuilder);

  constructor() {
    this.formularioLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const accessToken = params['access_token'];
      const refreshToken = params['refresh_token'];

      if (accessToken && refreshToken) {
        this.authService.handleGoogleCallback(accessToken, refreshToken).subscribe(() => {
          this.isLoading = false;
          this.exportLoggedIn.emit(true);
          this.router.navigate(['/']); // Redirige si hace falta
        });
      } else {
        this.isLoading = false;
      }
    });

    // Opcional: valores por defecto para pruebas
    this.formularioLogin.setValue({
      email: 'a@gmail.com',
      password: '123'
    });
  }

  hasError(controlName: string, errorType: string): boolean {
    return !!this.formularioLogin.get(controlName)?.hasError(errorType) &&
           !!this.formularioLogin.get(controlName)?.touched;
  }

  login(): void {
    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }

    const loginData = this.formularioLogin.value;

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log(response);
        if (response.user.role === 'admin') {
          const accessToken = response.accessToken;
          const refreshToken = response.refreshToken;

          if (accessToken && refreshToken) {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);

            this.exportLoggedIn.emit(true);
            this.router.navigate(['/']); // Redirige si hace falta
          } else {
            console.error('Tokens faltantes en la respuesta.');
          }
        } else {
          this.toastr.error('Solo el administrador tiene acceso al backoffice', 'Acceso denegado',{
           positionClass: 'toast-top-center'
        });
        }
      },
      error: (error) => {
        console.error('Error en el login:', error);
        this.toastr.error('Error login verifique sus credenciales', 'Acceso denegado',{
           positionClass: 'toast-top-center'
        });
      }
    });
  }
  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
}

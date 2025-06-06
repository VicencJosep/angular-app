import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../services/communication.service';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-edit-form',
  standalone: true, // Marca el componente como standalone
  imports: [CommonModule, ReactiveFormsModule], // Importa ReactiveFormsModule aquí
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css'],
})
export class EditFormComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  editForm!: FormGroup;
  usuario : User = new User(); // Inicializa el usuario como un objeto vacío
  toastr = inject(ToastrService);
  constructor(private fb: FormBuilder, private communicationService: CommunicationService) {}
  userService = inject(UserService);
  ngOnInit(): void {
    this.communicationService.currentUser.subscribe((user: User) => {
      this.usuario = user; // Asigna el usuario recibido al objeto usuario
      console.log('Usuario recibido en el componente:', this.usuario);

    });
    this.editForm = this.fb.group({

      name: [this.usuario.name, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
      phone: [this.usuario.phone, Validators.required],
      password: [this.usuario.password, Validators.required], // Mantener la contraseña actual
      role: [this.usuario.role, Validators.required],
      birthdate: [this.usuario.birthdate, Validators.required]
    });
  }
  editUser() {
    if (!this.usuario.id) {
      console.error("Error: el usuario no tiene un ID válido.");
      return;
    }

    const updatedUser: { id: string; name: string; email: string; password: string; phone: string; available: boolean; packets: string[] , role: string,birthdate:Date} = {
      id: this.usuario.id, // Ahora estamos seguros de que _id es una string
      name: this.editForm.value.name || this.usuario.name,
      email: this.editForm.value.email || this.usuario.email,
      password: this.editForm.value.password||this.usuario.password, // No modificar la contraseña
      phone: this.editForm.value.phone || this.usuario.phone,
      available: this.usuario.available,
      packets: this.usuario.packets,
      role: this.editForm.value.role || this.usuario.role,
      birthdate: this.editForm.value.birthdate || this.usuario.birthdate
    };

    this.userService.editUser(updatedUser.id, updatedUser).subscribe(
      (response) => {
        this.toastr.info('Usuario actualizado correctamente', 'Exitoso',{
           positionClass: 'toast-top-center'
        });
        this.router.navigate(['/user-component']);
        console.log('Usuario editado:', response);

      },
      (error) => {
        console.error('Error al editar usuario:', error);
        this.toastr.error('Error al editar el usuario', 'Error',{
           positionClass: 'toast-top-center'
        });
      }
    );
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      console.log('Formulario enviado:', this.editForm.value);
      // Lógica adicional para guardar los cambios
    }
  }
}

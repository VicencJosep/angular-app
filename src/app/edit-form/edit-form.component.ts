import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../services/communication.service';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-edit-form',
  standalone: true, // Marca el componente como standalone
  imports: [CommonModule, ReactiveFormsModule], // Importa ReactiveFormsModule aquí
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css'],
})
export class EditFormComponent implements OnInit {
  editForm!: FormGroup;
  usuario : User = new User(); // Inicializa el usuario como un objeto vacío

  constructor(private fb: FormBuilder, private communicationService: CommunicationService) {}
  userService = inject(UserService);
  ngOnInit(): void {
    this.communicationService.currentUser.subscribe((user: User) => {
      this.usuario = user; // Asigna el usuario recibido al objeto usuario
      console.log('Usuario recibido en el componente:', this.usuario);

    });
    this.editForm = this.fb.group({
      
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });
  }
  editUser() {
    if (!this.usuario._id) {
      console.error("Error: el usuario no tiene un ID válido.");
      return;
    }
  
    const updatedUser: { _id: string; name: string; email: string; password: string; phone: string; available: boolean; packets: string[] } = {
      _id: this.usuario._id, // Ahora estamos seguros de que _id es una string
      name: this.editForm.value.name || this.usuario.name,
      email: this.editForm.value.email || this.usuario.email,
      password: this.usuario.password, // No modificar la contraseña
      phone: this.editForm.value.phone || this.usuario.phone,
      available: this.usuario.available,
      packets: this.usuario.packets
    };
  
    this.userService.editUser(updatedUser._id, updatedUser).subscribe(
      (response) => {
        console.log('Usuario editado:', response);
      },
      (error) => {
        console.error('Error al editar usuario:', error);
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

import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { PacketService } from '../services/packet.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
  standalone: true
})
export class RegisterFormComponent {
  registerForm: FormGroup;
  packetForm: FormGroup;
  activeTab: 'user' | 'packet' = 'user'; // Control de pestañas
  toastr= inject(ToastrService);
  constructor(private fb: FormBuilder, private userService: UserService, private packetService: PacketService) {
    // Formulario de Usuario
    this.registerForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      phone: [''],
      packets: ['']
    });

    // Formulario de Paquete
    this.packetForm = this.fb.group({
      name: [''],
      description: [''],
      status: ['']
    });
  }

  // ✅ Este método estaba faltando, lo agregamos aquí:
  setActiveTab(tab: 'user' | 'packet') {
    this.activeTab = tab;
  }

  // Enviar formulario de usuario
  registerUser() {
    if ((this.registerForm.valid)||((this.registerForm.value.name.length>0)&&(this.registerForm.value.packets.length==0)&&(this.registerForm.value.phone.length>0)&&(this.registerForm.value.email.length>0)&&(this.registerForm.value.password.length>0))) {
      const userData = this.registerForm.value;userData.available = true;
      userData.packets = userData.packets || []; // Asegura que sea un array
      this.userService.createUser2(userData).subscribe({
        next: (response) => {
            this.toastr.success('Usuario registrado exitosamente', 'Exitoso', {
              positionClass: 'toast-top-center'
            });
        },
        error: (error) => {
          this.toastr.error('Error en el registro del usuario', 'Error', {
            positionClass: 'toast-top-center'
          });
        }
      });
    }
  }

  // Enviar formulario de paquete
  registerPacket() {
    if (this.packetForm.valid) {
      const packetData = this.packetForm.value;
      console.log("packetData:",packetData
      );
        this.packetService.createPacket(packetData).subscribe({
          next: (response) => {
            this.toastr.success('Paquete registrado exitosamente', 'Exitoso', {
              positionClass: 'toast-top-center'
            });
          },
          error: (error) => {
            this.toastr.error('Error en el registro del paquete', 'Error', {
              positionClass: 'toast-top-center'
            });
          }
      });
    }
  }
}

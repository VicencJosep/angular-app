import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../services/communication.service';
import { Packet } from '../models/packet.model';
import { PacketService } from '../services/packet.service';

@Component({
  selector: 'app-edit-packet-form',
  standalone: true, // Marca el componente como standalone
  imports: [CommonModule, ReactiveFormsModule], // Importa los módulos necesarios
  templateUrl: './edit-packet-form.component.html',
  styleUrls: ['./edit-packet-form.component.css']
})
export class EditPacketFormComponent {
  editPacketForm!: FormGroup;
  paquete: Packet = new Packet(); // Inicializa el paquete como un objeto vacío

  constructor(private fb: FormBuilder, private communicationService: CommunicationService) {}
  packetService = inject(PacketService);

  ngOnInit(): void {
    this.communicationService.currentPacket.subscribe((packet: Packet) => {
      this.paquete = packet; // Asigna el paquete recibido al objeto paquete
      console.log('Paquete recibido en el componente:', this.paquete);
    });

    this.editPacketForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  editPacket() {
    if (!this.paquete._id) {
      console.error("Error: el paquete no tiene un ID válido.");
      return;
    }

    const updatedPacket: { _id: string; name: string; description: string; status: string } = {
      _id: this.paquete._id, // Asegura que _id es una string válida
      name: this.editPacketForm.value.name || this.paquete.name,
      description: this.editPacketForm.value.description || this.paquete.description,
      status: this.editPacketForm.value.status || this.paquete.status,
    };

    this.packetService.editPacket(updatedPacket._id, updatedPacket).subscribe(
      (response) => {
        console.log('Paquete editado:', response);
      },
      (error) => {
        console.error('Error al editar paquete:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.editPacketForm.valid) {
      console.log('Formulario enviado:', this.editPacketForm.value);
      // Lógica adicional para guardar los cambios
    }
  }
  
}

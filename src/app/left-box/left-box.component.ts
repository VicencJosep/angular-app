import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommunicationService } from '../services/communication.service';
@Component({
  selector: 'app-left-box',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './left-box.component.html',
  styleUrl: './left-box.component.css'
})
export class LeftBoxComponent {
  constructor(private communicationService: CommunicationService) {}

  sendPacketMessage() {
    this.communicationService.sendMessage('packet');
    this.communicationService.sendPacketsList([]);
  }

  sendUserMessage() {
    this.communicationService.sendMessage('user');
    this.communicationService.sendUsersList([]);
  }
}

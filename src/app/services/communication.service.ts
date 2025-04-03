import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import{User} from '../models/user.model';
import { Packet } from '../models/packet.model';


@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private messageSource = new BehaviorSubject<string>('user');
  currentMessage = this.messageSource.asObservable();
  private userSource = new BehaviorSubject<User>({} as User);
  currentUser = this.userSource.asObservable();

  sendUser(user: User) {
    console.log('🔄 Enviando usuario desde el servicio:', user);
    this.userSource.next(user);}

  sendMessage(message: string) {
    console.log('🔄 Enviando mensaje desde el servicio:', message);
    this.messageSource.next(message);
  }
  private packetSource = new BehaviorSubject<Packet>({} as Packet);
  currentPacket = this.packetSource.asObservable();
  sendPacket(packet: Packet) {
    console.log('🔄 Enviando paquete desde el servicio:', packet);
    this.packetSource.next(packet);
  }
}

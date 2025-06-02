export interface Packet {
  _id: string;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
  deliveredAt?: Date;
  size: Number;
  weight: Number;
  deliveryId?: string;
  origin?: string;
  destination?: string;
  location?: string;
  seleccionado?: boolean;
}
export class Packet implements Packet {
  constructor() {
    this.seleccionado = false;
  }
}

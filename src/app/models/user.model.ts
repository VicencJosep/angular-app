export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  available: boolean;
  packets: string[];
  role: "admin" | "user" | "delivery";
  birthdate: Date;
  isProfileComplete: boolean;
  seleccionado?: boolean;
  deliveryProfile?: {
    assignedPacket: string[];
    deliveredPackets: string[];
    vehicle: string;
  };

  }
export class User implements User {

    constructor() {
      this.seleccionado = false;
    }
}

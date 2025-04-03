import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { PacketComponent } from './packet/packet.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchComponent } from './search/search.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { EditFormComponent } from './edit-form/edit-form.component';
import { EditPacketFormComponent } from './edit-packet-form/edit-packet-form.component';

export const routes: Routes = [
  // Define aquí tus rutas
  {path: 'packet-component', component: PacketComponent},
  {path: 'user-component', component: UserComponent},
  {path: 'register-component', component: RegisterFormComponent},
  { path: 'search', component: SearchComponent },
  {path: 'edit-component', component: EditFormComponent},
  {path: 'edit-packet-component', component: EditPacketFormComponent},
  { path: '',   redirectTo: '/user-component', pathMatch: 'full' },
  {path: '**', component: PageNotFoundComponent},
];

import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { PacketComponent } from './packet/packet.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchComponent } from './search/search.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { EditFormComponent } from './edit-form/edit-form.component';
import { EditPacketFormComponent } from './edit-packet-form/edit-packet-form.component';
import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  // Define aquí tus rutas
  {path: 'packet-component', component: PacketComponent, canActivate: [AuthGuard]},
  {path: 'user-component', component: UserComponent, canActivate: [AuthGuard]},
  {path: 'register-component', component: RegisterFormComponent},
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  {path: 'edit-component', component: EditFormComponent, canActivate: [AuthGuard]},
  {path: 'edit-packet-component', component: EditPacketFormComponent, canActivate: [AuthGuard]},
  { path: '',   redirectTo: '/user-component', pathMatch: 'full' },
  {path: '**', component: PageNotFoundComponent},
];

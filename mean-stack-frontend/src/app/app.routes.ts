import { AuthGuard } from './auth.guard';
import { Routes } from '@angular/router';

import { Landing } from './landing/landing';
import { Login } from './login/login';
import { Register } from './register/register';
import { CalendarPage } from './calendar/calendar';
import { AddEntry } from './add-entry/add-entry';
import { ViewEntry } from './view-entry/view-entry';
import { Archive } from './archive/archive';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Protected pages
  { path: 'calendar', component: CalendarPage, canActivate: [AuthGuard] },
  { path: 'add-entry', component: AddEntry, canActivate: [AuthGuard] },
  { path: 'view-entry/:id', component: ViewEntry, canActivate: [AuthGuard] },
  { path: 'archive', component: Archive, canActivate: [AuthGuard] },

  // Wildcard – redirect everything unknown back to login
  { path: '**', redirectTo: 'login' }
];



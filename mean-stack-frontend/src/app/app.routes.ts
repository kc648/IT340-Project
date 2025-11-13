import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { Login } from './login/login';
import { Register } from './register/register';
import { Calendar } from './calendar/calendar';
import { AddEntry } from './add-entry/add-entry';
import { ViewEntry } from './view-entry/view-entry';
import { Archive } from './archive/archive';

export const routes: Routes = [
	{ path: '', component: Landing },
	{ path: 'login', component: Login },
	{ path: 'register', component: Register },
	{ path: 'calendar', component: Calendar },
	{ path: 'add-entry', component: AddEntry },
	{ path: 'view-entry', component: ViewEntry },
	{ path: 'archive', component: Archive },
];


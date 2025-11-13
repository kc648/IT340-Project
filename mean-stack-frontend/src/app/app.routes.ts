import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { Login } from './login/login';
import { Register } from './register/register';
import { Calendar } from './calendar/calendar';

export const routes: Routes = [
	{ path: '', component: Landing },
	{ path: 'login', component: Login },
	{ path: 'register', component: Register },
	{ path: 'calendar', component: Calendar },
];

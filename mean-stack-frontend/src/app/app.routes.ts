import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { Login } from './login/login';

export const routes: Routes = [
	{ path: '', component: Landing },
	{ path: 'login', component: Login },
];

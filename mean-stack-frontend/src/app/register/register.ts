import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
	username: string = '';
	email: string = '';
	password: string = '';

	onSubmit () {
		console.log('User successfully registered.');
		console.log('Username: ', this.username);
		console.log('Email: ', this.email);
	}
}

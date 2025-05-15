import { Component, inject } from '@angular/core';
import axios from 'axios';
import { AuthService } from '../auth.service';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register.component.html',
})

export default class RegisterComponent {
  constructor(private authService: AuthService) { }
  status = inject(AuthService);

  formData = {
    email: '',
    password: ''
  }

  handleOnChange(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.formData[field as 'email' | 'password'] = value
  }

  async submitForm(event: Event) {
    event.preventDefault();
    const { email, password } = this.formData;

    try {
      const response: any = await firstValueFrom(this.authService.registerUser(email, password));
      const token = response.authToken;
      const role = response.role;

      localStorage.setItem('authToken', token);
      localStorage.setItem('role', role);
      this.status.login();
      alert('Usuario registrado');
    } catch (error) {
      console.log(error);
      alert('Error al registrar el usuario');
    }
  }
}


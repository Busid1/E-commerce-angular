import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
})

export default class LoginComponent {
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
      const response: any = await firstValueFrom(this.authService.loginUser(email, password));
      const token = response.authToken;
      const role = response.role;

      localStorage.setItem('authToken', token);
      localStorage.setItem('role', role);
      alert('Bienvenido de nuevo');
      this.status.login();
    } catch (error) {
      console.log(error);
      alert('Error al iniciar sesión');
    }
  }
}

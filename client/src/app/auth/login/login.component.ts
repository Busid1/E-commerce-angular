import { Component, inject } from '@angular/core';
import axios from 'axios';
import { AuthService } from '../auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
})

export default class LoginComponent {
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
      await axios.post('http://localhost:2000/login', { email, password }, {withCredentials: true})
        .then(response => {
          const token = response.data.authToken;          
          const role = response.data.role;          
          localStorage.setItem("authToken", token)
          localStorage.setItem("role", role)
        })
      alert('Bienvenido de nuevo');
      this.status.login();
    } catch (error) {
      console.log(error);
      alert('Error al iniciar sesión');
    }
  }
}

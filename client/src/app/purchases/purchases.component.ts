import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './purchases.component.html',
})
export default class PurchasesComponent {
  purchases: any[] = []; // Almacena las compras aquí

  constructor() {
    this.fetchPurchases();
  }

  async fetchPurchases() {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get('http://localhost:2000/user/purchases', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      this.purchases = response.data; // Asigna los datos recibidos
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }    
  }
}

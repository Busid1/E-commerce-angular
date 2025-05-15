import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ProductService } from '../products/data-access/products.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './purchases.component.html',
})
export default class PurchasesComponent {
  constructor(private productsService: ProductService) {
    this.fetchPurchases();
  }

  purchases: any[] = [];

  async fetchPurchases() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await firstValueFrom(this.productsService.getAllPurchases(token));
      this.purchases = response;

    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  }
}

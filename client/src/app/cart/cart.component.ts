import { Component, inject, input } from '@angular/core';
import { CartItemComponent } from "./ui/cart-item/cart-item.component";
import { CartStateService } from '../shared/data-access/cart-state.service';
import { Product, ProductItemCart } from '../shared/interfaces/product.interface';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '../products/data-access/products.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemComponent, CurrencyPipe, RouterLink, CommonModule],
  templateUrl: './cart.component.html',
})

export default class CartComponent {
  state = inject(CartStateService).state;
  product = input.required<Product>();
  constructor(private productsService: ProductService) { }

  async onRemove(_id: string) {
    this.state.remove(_id)
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    await firstValueFrom(this.productsService.removeFromCart(_id, token))
  }
  
  async onIncrease(product: ProductItemCart) {
    this.state.update({
      ...product,
      quantity: product.quantity + 1
    })

    const token = localStorage.getItem('authToken');
    if (!token) return;

    await firstValueFrom(this.productsService.increaseCart(product.product._id, product.quantity + 1, token))
  }

  async onDecrease(product: ProductItemCart) {
    this.state.update({
      ...product,
      quantity: product.quantity - 1
    })
    if (product.quantity <= 0) {
      this.state.update({
        ...product,
        quantity: 0
      })
    }

    const token = localStorage.getItem('authToken');
    if (!token) return;

    await firstValueFrom(this.productsService.decreaseCart(product.product._id, product.quantity + 1, token))
  }
}

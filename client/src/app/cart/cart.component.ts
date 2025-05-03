import { Component, inject, input } from '@angular/core';
import { CartItemComponent } from "./ui/cart-item/cart-item.component";
import { CartStateService } from '../shared/data-access/cart-state.service';
import { Product, ProductItemCart } from '../shared/interfaces/product.interface';
import { CurrencyPipe } from '@angular/common';
import axios from 'axios';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemComponent, CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styles: ``
})

export default class CartComponent {
  state = inject(CartStateService).state;
  product = input.required<Product>();

  async onRemove(_id: string) {
    this.state.remove(_id)
    const token = localStorage.getItem('authToken');
    await axios.delete(`http://localhost:2000/cart/${_id}`, {
      data: { productId: _id },
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  async onIncrease(product: ProductItemCart) {
    this.state.update({
      ...product,
      quantity: product.quantity + 1
    })
    
    const token = localStorage.getItem('authToken');
    await axios.post('http://localhost:2000/user/cart', { productId: product.product._id }, {headers: {Authorization: `Bearer ${token}`}})
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
    await axios.post('http://localhost:2000/user/cart/decrease', { productId: product.product._id }, {headers: {Authorization: `Bearer ${token}`}})
  }
}

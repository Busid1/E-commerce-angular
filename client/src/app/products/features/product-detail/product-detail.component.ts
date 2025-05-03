import { Component, effect, inject } from '@angular/core';
import ProductDetailStateService from '../../data-access/product-detail-state.service';
import { CurrencyPipe } from '@angular/common';
import { CartStateService } from '../../../shared/data-access/cart-state.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-detail.component.html',
  providers: [ProductDetailStateService]
})

export default class ProductDetailComponent {
  productDetailState = inject(ProductDetailStateService).state;
  cartState = inject(CartStateService).state;
  route = inject(ActivatedRoute);
  isAuthenticated = inject(AuthService);
  
  addToCart(){
    this.cartState.add({
      product: this.productDetailState.product()!,
      quantity: 1
    })
  }
  
  constructor() {
    effect(() => {
      const _id = this.route.snapshot.paramMap.get("product_id")
      if(_id){
        this.productDetailState.getById(_id);
      }
    })
  }
}

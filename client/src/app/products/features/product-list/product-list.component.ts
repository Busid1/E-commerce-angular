import { Component, inject } from '@angular/core';
import { ProductsStateService } from '../../../shared/data-access/products-state.service';
import { ProductCardComponent } from '../../../product/ui/product-card/product-card.component';
import { CartStateService } from '../../../shared/data-access/cart-state.service';
import { Product } from '../../../shared/interfaces/product.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './product-list.component.html',
  styles: ``,
  providers: [ProductsStateService]
})

export default class ProductListComponent {
  productsState = inject(ProductsStateService);
  cartState = inject(CartStateService).state;

  async changePage() {
    const page = this.productsState.state.page() + 1;
    this.productsState.changePage$.next(page);    
  }

  addToCart(product:Product){
    this.cartState.add({
      product: product,
      quantity: 1
    })
  }
}

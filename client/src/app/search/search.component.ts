import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router'; // Para leer los parámetros de la URL
import { ProductsStateService } from '../shared/data-access/products-state.service'; // Asegúrate de que el servicio esté disponible
import { CurrencyPipe } from '@angular/common';
import { ProductCardComponent } from '../product/ui/product-card/product-card.component';
import { CartStateService } from '../shared/data-access/cart-state.service';
import { Product } from '../shared/interfaces/product.interface';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterModule, ProductCardComponent],  // Importar RouterModule si es necesario
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})

export default class SearchComponent {
  productsState = inject(ProductsStateService);
  productsList: Array<any> = [];
  searchQuery: string = '';
  cartState = inject(CartStateService).state; // Método para agregar al carrito

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Leemos el parámetro query de la URL
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['product'] || ''; // Asignamos el valor de búsqueda
      this.filterProducts(this.searchQuery); // Filtramos los productos
    });    
  }

  filterProducts(query: string) {
    const products = this.productsState.state.products();
    if (query) {
      this.productsList = products.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.productsList = products;
    }
  }

    addToCart(product:Product){
      this.cartState.add({
        product: product,
        quantity: 1
      })
    }
  
}

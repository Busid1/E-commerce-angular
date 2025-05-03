import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router'; // Para leer los parámetros de la URL
import { ProductsStateService } from '../shared/data-access/products-state.service'; // Asegúrate de que el servicio esté disponible
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterModule, CurrencyPipe],  // Importar RouterModule si es necesario
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})

export default class SearchComponent {
  productsState = inject(ProductsStateService);
  productsList: Array<any> = [];
  searchQuery: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Leemos el parámetro query de la URL
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query'] || ''; // Asignamos el valor de búsqueda
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
  
}

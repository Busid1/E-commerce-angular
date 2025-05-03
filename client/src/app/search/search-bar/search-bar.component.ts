import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductsStateService } from '../../shared/data-access/products-state.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CurrencyPipe, RouterModule],
  templateUrl: './search-bar.component.html',
})

export default class SearchBarComponent {
  productsState = inject(ProductsStateService);
  productsList: Array<any> = [];
  inputValue: string = '';  // Aquí almacenamos el valor de la búsqueda
  router = inject(Router);

  // Función para manejar el evento input y actualizar inputValue
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.inputValue = input.value; // Actualizamos el valor del input
    const filterGamesTitle = this.productsState.state.products().filter(game => {
      const lowGameTitle = game.title.toLowerCase();
      const currentInputValue = this.inputValue.toLowerCase();
      if (currentInputValue === "") {
        return false;
      }
      return lowGameTitle.includes(currentInputValue);
    });
    this.productsList = filterGamesTitle;
    this.productsState.setFilteredProducts(filterGamesTitle);
  }

  // Función para enviar el formulario y redirigir
  onSubmit(event: Event) {
    event.preventDefault();

    console.log('Submit clicked, input value: ', this.inputValue); // Verifica que el valor de inputValue se ha actualizado

    this.router.navigate(['/search'], {
      queryParams: { query: this.inputValue }  // Pasamos el valor de búsqueda como parámetro
    });

  }
}

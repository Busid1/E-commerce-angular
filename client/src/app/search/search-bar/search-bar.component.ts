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
  inputValue: string = '';
  router = inject(Router);

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.inputValue = input.value;
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

  onSubmit(event: Event) {
    event.preventDefault();

    console.log('Submit clicked, input value: ', this.inputValue);

    this.router.navigate(['/search'], {
      queryParams: { product: this.inputValue }
    });

  }
}

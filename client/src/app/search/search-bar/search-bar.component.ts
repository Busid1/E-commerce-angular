import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductsStateService } from '../../shared/data-access/products-state.service';
import Swal from 'sweetalert2';

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
    if(!this.inputValue){
      Swal.fire("The field is empty", "", "error")
      return
    }

    this.router.navigate(['/search'], {
      queryParams: { product: this.inputValue }
    });

  }
}

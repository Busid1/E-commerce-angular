import { Component, inject, input, output } from '@angular/core';
import { Product } from '../../../shared/interfaces/product.interface';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { CurrencyPipe } from '@angular/common';
import UpdateProductComponent from '../../../admin/crud/update-product/update-product.component';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '../../../products/data-access/products.service';
import { ToastCartComponent } from '../../../shared/ui/toast-cart/toast-cart.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, UpdateProductComponent, ToastCartComponent],
  templateUrl: './product-card.component.html',
  styles: ``
})

export class ProductCardComponent {
  constructor(private productsService: ProductService) { }
  product = input.required<Product>();
  isAuthenticated = inject(AuthService);
  public showUpdateModal = false;
  addToCart = output<Product>();
  addToCartToast = false;
  _id = ""

  async add(event: Event) {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    event.stopPropagation();
    event.preventDefault();
    this.addToCart.emit(this.product());
    this.addToCartToast = true;
    setTimeout(() => {
      this.addToCartToast = false;
    }, 3000);
    await firstValueFrom(this.productsService.addToCart(this.product()._id, token));
  }

  edit(event: Event) {
    document.body.classList.add("overflow-hidden");
    event.stopPropagation();
    event.preventDefault();
    this.showUpdateModal = true
    this._id = this.product()._id
  }

  delete(event: Event) {
    event.preventDefault();
    Swal.fire({
      title: "¿Seguro que quieres eliminar este producto?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: "No",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire("Producto eliminado", "", "success");
        await firstValueFrom(this.productsService.deleteProduct(this.product()._id));
        window.location.reload()
      } else if (result.isDenied) {
        Swal.fire("Producto no eliminado", "", "info");
      }
    });
  }
}

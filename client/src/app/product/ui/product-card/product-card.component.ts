import { Component, inject, input, output } from '@angular/core';
import { Product } from '../../../shared/interfaces/product.interface';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { CurrencyPipe } from '@angular/common';
import UpdateProductComponent from '../../../admin/crud/update-product/update-product.component';
import axios from 'axios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, UpdateProductComponent],
  templateUrl: './product-card.component.html',
  styles: ``
})
export class ProductCardComponent {
  product = input.required<Product>();
  isAuthenticated = inject(AuthService);
  public showUpdateModal = false;
  addToCart = output<Product>();
  _id = ""

  async add(event: Event) {
    const token = localStorage.getItem('authToken');
    event.stopPropagation();
    event.preventDefault();
    this.addToCart.emit(this.product());
    await axios.post('http://localhost:2000/user/cart', { productId: this.product()._id }, {headers: {Authorization: `Bearer ${token}`}})
  }

  edit(event: Event) {
    document.body.classList.add("overflow-hidden");
    event.stopPropagation();
    event.preventDefault();
    this.showUpdateModal = true
    this._id = this.product()._id
  }

  delete(event: Event) {
    event.stopPropagation();
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
        await axios.delete(`http://localhost:2000/delete/${this.product()._id}`)
        Swal.fire("Producto eliminado", "", "success");
        window.location.reload()
      } else if (result.isDenied) {
        Swal.fire("Producto no eliminado", "", "info");
      }
    });
  }
}

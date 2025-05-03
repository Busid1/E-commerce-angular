import { Component, effect, inject } from '@angular/core';
import { ProductCardComponent } from '../../../product/ui/product-card/product-card.component';
import ProductDetailStateService from '../../../products/data-access/product-detail-state.service';
import axios from 'axios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss',
  providers: [ProductDetailStateService]
})
export default class UpdateProductComponent {
  productState = inject(ProductCardComponent);

  closeUpdateModal() {
    this.productState.showUpdateModal = false
    document.body.classList.remove("overflow-hidden");
  }

  productDetailState = inject(ProductDetailStateService).state;
  constructor() {
    effect(() => {
      const _id = this.productState._id
      if (_id) {
        this.productDetailState.getById(_id);
      }
    })
  }

  formData = {
    title: this.productState.product().title,
    price: this.productState.product().price,
    category: this.productState.product().category,
    image: this.productState.product().image as string | File,
    description: this.productState.product().description,
  }

  handleOnChange(field: string, event: Event) {
    let value = (event.target as HTMLInputElement).value;
    if (field === "price" && value.length > 3) {
      value = value.slice(0, 3);
      (event.target as HTMLInputElement).value = value;
    }
    this.formData[field as 'title' | 'category' | 'description'] = value
  }

  handleFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.formData.image = file
    }
  }

  deleteProduct() {
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
        window.location.reload()
      } else if (result.isDenied) {
        Swal.fire("Producto no eliminado", "", "info");
      }
    });
  }

  async submitUpdateForm(event: Event) {
    event.preventDefault()
    Swal.fire({
      title: "¿Seguro que quieres actualizar este producto?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: "No",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(`http://localhost:2000/update/${this.productState._id}`, this.formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          Swal.fire("Producto actualizado", "", "success");
          setTimeout(() => {
            window.location.reload()
          }, 3000)
          console.log("Producto actualizado:", response.data);
        } catch (error) {
          console.error("Error al actualizar el producto:", error);
        }
      } else if (result.isDenied) {
        Swal.fire("Producto no actualizado", "", "info");
      }
    });
  }
}
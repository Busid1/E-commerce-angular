import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [],
  templateUrl: './create-product.component.html',
})

export default class CreateProductComponent {
  formData = {
    title: '',
    price: 0,
    category: '',
    image: null as File | string | null,
    description: '',
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
      this.formData.image = file;
    }
  }  

  async submitForm(event: Event) {
    event.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:2000/createProduct', this.formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log("Producto creado:", response.data);
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  }
  
}

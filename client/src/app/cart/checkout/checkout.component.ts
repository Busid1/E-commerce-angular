import { Component, inject, OnInit } from '@angular/core';
import { CartStateService } from '../../shared/data-access/cart-state.service';
import { CurrencyPipe } from '@angular/common';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { ProductService } from '../../products/data-access/products.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export default class CheckoutComponent implements OnInit {
  constructor(private productsService: ProductService) { }
  state = inject(CartStateService).state;
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  card: StripeCardElement | null = null;

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51PJC6AJeIz2JibtC32QxNpQqNVtPQ06sAJOfLd7CvEkux2WEKekyYZmCaT2gHCLGJSiXIxmWCU6iMwXeZstZAeWG00utnMfqhT'); // Reemplaza con tu clave pública
    this.elements = this.stripe?.elements() || null;
    this.card = this.elements?.create('card', {
      style: {
        base: {
          color: '#32325d',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4'
          }
        }
      }
    }) || null;
    this.card?.mount('#card-element');
  }

  async handleSubmit(event: Event) {
    event.preventDefault();

    if (!this.stripe || !this.card) return;

    const { error, paymentMethod } = await this.stripe.createPaymentMethod({
      type: "card",
      card: this.card,
    });

    if (error) {
      console.error('Stripe Error:', error);
    } else {
      try {
        const tokenStorage = localStorage.getItem('authToken');
        const { id } = paymentMethod;
        const amount = Number(this.state.price().toFixed(2)) * 100; // Convertir a centavos
        const products = this.state.products();
        
        if (!tokenStorage) {
          throw new Error('Authentication token not found');
        }
        
        await firstValueFrom(this.productsService.checkout(id, amount, products, tokenStorage));
        await Swal.fire("Product/s purchased", "", "success");
        window.location.href = '/purchases';
      } catch (error) {
        console.log('Request error:', error);
      }
    }
  }

}

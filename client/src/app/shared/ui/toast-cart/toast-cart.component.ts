import { CurrencyPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import UpdateProductComponent from "../../../admin/crud/update-product/update-product.component";
import { Component } from "@angular/core";

@Component({
  selector: 'app-toast-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, UpdateProductComponent],
  templateUrl: './toast-cart.component.html',
  styles: ``
})

export class ToastCartComponent {}
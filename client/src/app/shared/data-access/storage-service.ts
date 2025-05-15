import { Injectable } from "@angular/core";
import { firstValueFrom, from, Observable, of } from "rxjs";
import { ProductItemCart } from "../interfaces/product.interface";
import axios from "axios";
import { ProductService } from "../../products/data-access/products.service";

@Injectable({
    providedIn: "root"
})

export class StorageService {
    constructor(private productsService: ProductService) { }

    async userCartCount() {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        await firstValueFrom(this.productsService.getCart(token));
    }

    loadProducts(): Observable<ProductItemCart[]> {
        const token = localStorage.getItem('authToken');
        if (!token) {
            return of([]);
        }

        return from(
            axios.get(`http://localhost:2000/api/user/cart`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(response => {
                this.saveProducts(response.data);
                return response.data;
            })
        );
    }

    saveProducts(products: ProductItemCart[]): void {
        localStorage.setItem("products", JSON.stringify(products));
    }
}
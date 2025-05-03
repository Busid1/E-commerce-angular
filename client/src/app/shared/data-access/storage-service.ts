import { Injectable } from "@angular/core";
import { from, Observable, of } from "rxjs";
import { ProductItemCart } from "../interfaces/product.interface";
import axios from "axios";

@Injectable({
    providedIn: "root"
})

export class StorageService {
    async userCartCount() {
        const token = localStorage.getItem('authToken');
        await axios.get(`http://localhost:2000/user/cart`, { headers: { Authorization: `Bearer ${token}` } })
    }

    loadProducts(): Observable<ProductItemCart[]> {
        const token = localStorage.getItem('authToken');
        if (!token) {
            return of([]);
        }

        return from(
            axios.get(`http://localhost:2000/user/cart`, {
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
import { Injectable } from "@angular/core";
import { BaseHttpService } from "../../shared/data-access/base-http.service";
import { Observable } from "rxjs";
import { Product } from "../../shared/interfaces/product.interface";
const LIMIT = 5;
import { environment } from "../../../environments/environment.prod";

@Injectable({ providedIn: 'root' })
export class ProductService extends BaseHttpService {
    getProducts(page: number): Observable<Product[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/allProducts`, {
            params: {
                limit: page * LIMIT
            }
        });
    }

    getProduct(id: string): Observable<Product> {
        return this.http.get<Product>(`${environment.apiUrl}/${id}`);
    }

    createProduct(formData: any): Observable<Product> {
        return this.http.post<Product>(`${environment.apiUrl}/createProduct`, formData);
    }

    updateProduct(id: string, formData: any): Observable<Product> {
        return this.http.put<Product>(`${environment.apiUrl}/updateProduct/${id}`, formData);
    }

    deleteProduct(id: string): Observable<Product> {
        return this.http.delete<Product>(`${environment.apiUrl}/deleteProduct/${id}`);
    }

    addToCart(id: string, token: string): Observable<Product> {
        return this.http.post<Product>(`${environment.apiUrl}/user/cart`, { productId: id }, { headers: { Authorization: `Bearer ${token}` } });
    }

    getCart(token: string): Observable<Product[]> {
        return this.http.get<Product[]>(`${environment.apiUrl}/user/cart`, { headers: { Authorization: `Bearer ${token}` } });
    }

    removeFromCart(productId: string, token: string): Observable<Product> {
        return this.http.delete<Product>(`${environment.apiUrl}/cart/${productId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    increaseCart(productId: string, quantity: number, token: string): Observable<Product> {
        return this.http.post<Product>(`${environment.apiUrl}/user/cart`, { productId, quantity }, { headers: { Authorization: `Bearer ${token}` } });
    }

    decreaseCart(productId: string, quantity: number, token: string): Observable<Product> {
        return this.http.post<Product>(`${environment.apiUrl}/user/cart/decrease`, { productId, quantity }, { headers: { Authorization: `Bearer ${token}` } });
    }

    checkout(id: string, amount: number, products: any, token: string): Observable<Product[]> {
        return this.http.post<Product[]>(`${environment.apiUrl}/user/cart/checkout`, {id, amount: amount, products}, { headers: { Authorization: `Bearer ${token}` } });
    }

    getAllPurchases(token: string): Observable<Product[]> {
        return this.http.get<Product[]>(`${environment.apiUrl}/user/purchases`, { headers: { Authorization: `Bearer ${token}` } });
    }
}
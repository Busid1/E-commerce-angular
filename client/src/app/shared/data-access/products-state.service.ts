import { inject, Injectable, signal } from "@angular/core";
import { Product } from "../interfaces/product.interface";
import { signalSlice } from "ngxtension/signal-slice";
import { ProductService } from "../../products/data-access/products.service";
import { catchError, map, of, startWith, Subject, switchMap } from "rxjs";

interface State {
    products: Product[];
    status: 'loading' | 'success' | 'error';
    page: number
}

@Injectable({
    providedIn: "root"
})

export class ProductsStateService {
    private productsService = inject(ProductService)

    private initialState: State = {
        products: [],
        status: 'loading' as const,
        page: 1
    };

    changePage$ = new Subject<number>();

    loadProducts$ = this.changePage$.pipe(
        startWith(1),
        switchMap((page) => this.productsService.getProducts(page)),
        map((products => ({ products, status: 'success' as const }))),
        catchError(() => {
            return of({
                products: [],
                status: "error" as const,
            })
        })
    )

    state = signalSlice({
        initialState: this.initialState,
        sources: [
            this.changePage$.pipe(
                map((page) => ({ page, status: "loading" } as const))
            ),
            this.loadProducts$
        ]
    })

    private _filteredProducts = signal<Product[]>([]);
    private _inputValue = signal('');

    setFilteredProducts(products: Product[]) {
        this._filteredProducts.set(products);
    }

    get filteredProducts() {
        return this._filteredProducts();
    }

    setInputValue(value: string) {
        this._inputValue.set(value);
    }

    get inputValue() {
        return this._inputValue();
    }

    constructor() {
        this.changePage$.next(1); // Carga inicial de productos
      }
      
}

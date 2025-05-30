import { inject, Injectable, Signal } from "@angular/core";
import { ProductItemCart } from "../interfaces/product.interface";
import { signalSlice } from "ngxtension/signal-slice";
import { StorageService } from "./storage-service";
import { map, Observable } from "rxjs";

interface State {
    products: ProductItemCart[];
    loaded: boolean;
}

@Injectable({
    providedIn: "root"
})

export class CartStateService {
    private _storageService = inject(StorageService);

    private initialState: State = {
        products: [],
        loaded: false
    }

    loadProducts$ = this._storageService
        .loadProducts()
        .pipe(map((products) => ({
            products, loaded: true
        })));

    state = signalSlice({
        initialState: this.initialState,
        sources: [this.loadProducts$],
        selectors: (state) => ({
            count: () => (Array.isArray(state().products) ? state().products : []).reduce(
                (acc, product) => acc + product.quantity,
                0
            ),
            price: () => (Array.isArray(state().products) ? state().products : []).reduce(
                (acc, product) => acc + product.product.price * product.quantity,
                0
            )
        }),
        actionSources: {
            add: (state, action$: Observable<ProductItemCart>) =>
                action$.pipe(map((product) => this.add(state, product))),
            remove: (state, action$: Observable<string>) =>
                action$.pipe(map((id) => this.remove(state, id))),
            update: (state, action$: Observable<ProductItemCart>) => action$.pipe(map(product => this.update(state, product)))
        },
        effects: (state) => ({
            load: () => {
                if (state().loaded) {
                    this._storageService.saveProducts(state().products);
                }
            }
        })
    })

    private add(state: Signal<State>, product: ProductItemCart) {
        const isInCart = Array.isArray(state().products)
            ? state().products.find((productInCart) =>
                productInCart.product._id === product.product._id
            )
            : undefined;


        if (!isInCart) {
            return {
                products: [...state().products, { ...product, quantity: 1 }]
            }
        }

        isInCart.quantity += 1;
        return {
            product: [...state().products]
        }
    }

    private remove(state: Signal<State>, id: string) {
        return {
            products: state().products.filter((product) => product.product._id !== id)
        }
    }

    private update(state: Signal<State>, product: ProductItemCart) {
        const products = state().products.map((productInCart) => {
            if (productInCart.product._id === product.product._id) {
                return { ...productInCart, quantity: product.quantity }
            }

            return productInCart
        })

        return { products }
    }
}
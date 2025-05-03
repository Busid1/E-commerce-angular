import { Routes } from "@angular/router";

export default [
    {
        path: "",
        loadComponent: () => import('./cart.component')
    },
    {
        path: "checkout",
        loadComponent: () => import('./checkout/checkout.component')
    }
 ] as Routes
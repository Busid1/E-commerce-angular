import { Routes } from "@angular/router";

export default [
    {
        path: "",
        loadComponent: () => import('./purchases.component')
    }
] as Routes
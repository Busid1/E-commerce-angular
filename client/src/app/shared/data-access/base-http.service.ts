import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export abstract class BaseHttpService {
    protected http = inject(HttpClient);
    protected apiProductsUrl = "http://localhost:10000/api";
    protected apiAuthUrl = "http://localhost:10000/api/auth";
}
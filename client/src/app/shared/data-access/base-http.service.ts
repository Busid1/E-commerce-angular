import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export class BaseHttpService {
    http = inject(HttpClient);
    apiUrl = "http://localhost:2000";
}
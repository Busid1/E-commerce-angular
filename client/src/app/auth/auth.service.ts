import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'
import { BaseHttpService } from '../shared/data-access/base-http.service';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class AuthService extends BaseHttpService {
    private isAuthenticated = this.handleIsAuthenticated();
    private router: Router;

    constructor(router: Router) {
        super();
        this.router = router;
    }

    handleIsAuthenticated() {
        if (localStorage.getItem("authToken")) {
            return true
        }
        return false
    }

    isLoggedIn(): boolean {
        return this.isAuthenticated;
    }

    login(): void {
        if (localStorage.getItem("authToken")) {
            this.isAuthenticated = true;
            this.router.navigate(['/']);
            console.log("Te has logueado");
        }
    }

    logout(): void {
        this.isAuthenticated = false;
        localStorage.removeItem("authToken")
        localStorage.removeItem("role")
    }

    getUserRole() {
        const token = localStorage.getItem("authToken");
        if (!token) return null;

        const decoded: any = jwtDecode(token);
        if (decoded.role === "user") {
            return false
        }
        return true;
    }

    loginUser(email: string, password: string) {
        return this.http.post(`${environment.apiUrl}/auth/login`, { email, password }, { withCredentials: true });
    }

    registerUser(email: string, password: string) {
        return this.http.post(`${environment.apiUrl}/auth/register`, { email, password }, { withCredentials: true });
    }
}

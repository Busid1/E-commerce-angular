import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    handleIsAuthenticated() {
        if (localStorage.getItem("authToken")) {
            return true
        }
        return false
    }

    private isAuthenticated = this.handleIsAuthenticated();
    constructor(private router: Router) { }

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
        if(decoded.role === "user"){
            return false
        }
        return true;
    }
}

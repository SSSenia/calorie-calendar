import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "@auth0/auth0-angular";
import { Observable, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private auth: AuthService,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.auth.isAuthenticated$.pipe(
            tap((value) => {
                if (!value) this.router.navigate(['/start'])
            })
        );
    }
}
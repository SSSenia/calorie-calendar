import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "@auth0/auth0-angular";
import { map, Observable, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class StartGuard implements CanActivate {
    constructor(
        private auth: AuthService,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.auth.isAuthenticated$.pipe(
            map((value) => {
                if (value) this.router.navigate(['/calendar'])
                return !value;
            })
        );
    }
}
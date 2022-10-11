import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "@auth0/auth0-angular";
import { map, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class StartGuard implements CanActivate {
    constructor(
        private auth: AuthService,
        private router: Router) { }

    public canActivate(): boolean | Observable<boolean> | Promise<boolean> {
        return this.auth.isAuthenticated$.pipe(
            map((value) => {
                if (value) this.router.navigate(['/calendar'])
                return !value;
            })
        );
    }
}
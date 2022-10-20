import { Injectable } from "@angular/core";
import { CanMatch, Router, UrlTree } from "@angular/router";
import { AuthService } from "@auth0/auth0-angular";
import { map, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class StartGuard implements CanMatch {
    constructor(
        private auth: AuthService,
        private router: Router) { }

    public canMatch(): Observable<boolean | UrlTree> {
        return this.auth.isAuthenticated$.pipe(
            map((value) => !value || this.router.createUrlTree(['/calendar']))
        );
    }
}
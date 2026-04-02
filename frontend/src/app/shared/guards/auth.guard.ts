import { CanActivateFn, Router } from "@angular/router";
import { AuthFacade } from "../store/auth/auth.facade";
import { inject } from "@angular/core/primitives/di";
import { map, take } from "rxjs";

export const authGuard: CanActivateFn = (route, state) => {
    const facade = inject(AuthFacade);
    const router = inject(Router);

    return facade.isAuthenticated$.pipe(
        take(1),
        map(isAuthenticated => isAuthenticated ? true : router.createUrlTree(['/login']))
    );

}
import { CanActivateFn, Router } from "@angular/router";
import { map } from "rxjs/internal/operators/map";
import { take } from "rxjs/internal/operators/take";
import { AuthFacade } from "../store/auth/auth.facade";
import { inject } from "@angular/core/primitives/di";

export const unAuthGuard: CanActivateFn = (route, state) => {
    const facade = inject(AuthFacade);
    const router = inject(Router);

    return facade.isAuthenticated$.pipe(
        take(1),
        map(isAuthenticated => !isAuthenticated ? true : router.createUrlTree(['/network']))
    );
}
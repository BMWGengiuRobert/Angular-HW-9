import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { User___Service } from "../../services/user.service";
import { loadCurrentUserSuccess } from "../auth/auth.actions";
import { map } from "rxjs/internal/operators/map";
import { setTheme, toggleTheme, toggleThemeFailure, toggleThemeSuccess } from "./ui.actions";
import { catchError, of, switchMap, tap, withLatestFrom } from "rxjs";
import { selectIsDarkTheme } from "./ui.selectors";
import { selectCurrentUser } from "../auth/auth.selectors";
import { User } from "../../models/user.model";

@Injectable()
export class UiEffects {
    private readonly actions$ = inject(Actions);
    private readonly store = inject(Store);
    private readonly usersService = inject(User___Service);

    loadInitialTheme$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadCurrentUserSuccess),
            map(({ user }) => setTheme({ isDarkTheme: user.isDarkTheme ?? false }))
        )
    );

    applyTheme$ = createEffect(() =>
        this.actions$.pipe(
            ofType(setTheme, toggleThemeSuccess),
            withLatestFrom(this.store.select(selectIsDarkTheme)),
            tap(([_, isDarkTheme]) => {
                document.documentElement.classList.toggle('dark-theme', isDarkTheme)
            })
        ), { dispatch: false }
    );

    saveThemeToUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(toggleTheme),
            withLatestFrom(this.store.select(selectIsDarkTheme), this.store.select(selectCurrentUser)),
            switchMap(([_, isDarkTheme, currentUser]) => {

                const newTheme = !isDarkTheme;

                if (currentUser) {
                    const updatedUser: User = { ...currentUser, isDarkTheme: newTheme };

                    return this.usersService.updateUser(currentUser.id, updatedUser).pipe(
                        map(() => toggleThemeSuccess({ isDarkTheme: newTheme })),
                        catchError((error) => of(toggleThemeFailure({ error: error.message })))
                    );
                }

                return of(toggleThemeSuccess({ isDarkTheme: newTheme }));
            })
        )
    )

}
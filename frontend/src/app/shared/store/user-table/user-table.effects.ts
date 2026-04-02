import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { User___Service } from "../../services/user.service";
import { catchError, map, of, switchMap, withLatestFrom } from "rxjs";
import { loadTableUsers, loadTableUsersFailure, loadTableUsersSuccess, setInitialTablePreferences, updateTablePreferences, updateTablePreferencesFailure, updateTablePreferencesSuccess } from "./user-table.actions";
import { defaultTablePreferences } from "./user-table.state";
import { loadCurrentUserSuccess } from "../auth/auth.actions";
import { selectUserTablePreferences } from "./user-table.selectors";
import { selectCurrentUser } from "../auth/auth.selectors";

@Injectable({ providedIn: "root" })
export class UserTableEffects {
    private readonly actions$ = inject(Actions);
    private readonly store = inject(Store);
    private readonly usersService = inject(User___Service);

    setInitialPreferences$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadCurrentUserSuccess),
            map(({ user }) => {
                const preferences = user.tablePreferences ?? defaultTablePreferences;
                return setInitialTablePreferences({ preferences });
            })
        )
    );

    loadUsersTable$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadTableUsers, setInitialTablePreferences, updateTablePreferences),
            withLatestFrom(this.store.select(selectUserTablePreferences)),
            switchMap(([_, preferences]) => {
                if (!preferences) return of(loadTableUsersFailure({ error: 'No preferences found' }));

                const query = {
                    search: preferences.searchFilter,
                    sort: preferences.sort.field,
                    order: preferences.sort.direction,
                    page: preferences.pagination.pageNumber,
                    limit: preferences.pagination.pageSize
                };

                return this.usersService.getAllUsers(query).pipe(
                    map((response) => loadTableUsersSuccess({ users: response.data })),
                    catchError((error) => of(loadTableUsersFailure({ error: error.message })))
                );
            })
        )
    );

    savePreferences$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateTablePreferences),
            withLatestFrom(
                this.store.select(selectUserTablePreferences),
                this.store.select(selectCurrentUser)
            ),
            switchMap(([_, preferences, currentUser]) => {
                
                if (currentUser && preferences) {
                    const updatedUser = { ...currentUser, tablePreferences: preferences };

                    return this.usersService.updateUser(currentUser.id, updatedUser).pipe(
                        map(() => updateTablePreferencesSuccess({ preferences })),
                        catchError((error) => of(updateTablePreferencesFailure({ error: error.message })))
                    );
                }

                return of(updateTablePreferencesFailure({ error: 'No user logged in' }));
            })
        )
    );

}
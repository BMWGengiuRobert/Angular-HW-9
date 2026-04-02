import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectUserTableLoading, selectUserTablePreferences } from "./user-table.selectors";
import { selectUserTableUsers } from "./user-table.selectors";
import { loadTableUsers, updateTablePreferences } from "./user-table.actions";
import { TablePreferences } from "../../models/table-preferences.model";

@Injectable({ providedIn: "root" })
export class UserTableFacade {
    private readonly store = inject(Store);

    public readonly usersTable$ = this.store.select(selectUserTableUsers);
    public readonly loadingUsersTable$ = this.store.select(selectUserTableLoading);
    public readonly errorUsersTable$ = this.store.select(selectUserTableLoading);
    public readonly preferencesUsersTable$ = this.store.select(selectUserTablePreferences);

    getUsersTable() {
        return this.store.dispatch(loadTableUsers());
    }

    updatePreferences(preferences: TablePreferences) {
        return this.store.dispatch(updateTablePreferences({ preferences }));
    }

}
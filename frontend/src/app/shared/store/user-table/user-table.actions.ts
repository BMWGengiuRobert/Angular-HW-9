import { createAction, props } from "@ngrx/store";
import { TablePreferences } from "../../models/table-preferences.model";
import { User } from "../../models/user.model";

export const setInitialTablePreferences = createAction(
    '[User Table] Set Initial Table Preferences',
    props<{ preferences: TablePreferences }>()
);


export const loadTableUsers = createAction(
    '[User Table] Load Table Users'
);
export const loadTableUsersSuccess = createAction(
    '[User Table] Load Table Users Success',
    props<{ users: User[] }>()
);
export const loadTableUsersFailure = createAction(
    '[User Table] Load Table Users Failure',
    props<{ error: string }>()
);


export const updateTablePreferences = createAction(
    '[User Table] Update Table Preferences',
    props<{ preferences: TablePreferences }>()
);
export const updateTablePreferencesSuccess = createAction(
    '[User Table] Update Table Preferences Success',
    props<{ preferences: TablePreferences }>()
);
export const updateTablePreferencesFailure = createAction(
    '[User Table] Update Table Preferences Failure',
    props<{ error: string }>()
);
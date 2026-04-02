import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserTableState } from "./user-table.state";

export const USER_TABLE_FEATURE_KEY = 'userTable';

export const selectUserTableState = createFeatureSelector<UserTableState>(USER_TABLE_FEATURE_KEY);

export const selectUserTableUsers = createSelector(
    selectUserTableState,
    (state: UserTableState) => state.users
);

export const selectUserTableLoading = createSelector(
    selectUserTableState,
    (state: UserTableState) => state.loading
);

export const selectUserTableError = createSelector(
    selectUserTableState,
    (state: UserTableState) => state.error
);

export const selectUserTablePreferences = createSelector(
    selectUserTableState,
    (state: UserTableState) => state.preferences
);
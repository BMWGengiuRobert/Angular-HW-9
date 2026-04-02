import { createReducer, on } from "@ngrx/store";
import {
    loadTableUsers,
    loadTableUsersFailure,
    loadTableUsersSuccess,
    setInitialTablePreferences,
    updateTablePreferences,
    updateTablePreferencesFailure,
    updateTablePreferencesSuccess
} from "./user-table.actions";
import { initialUserTableState } from "./user-table.state";

export const userTableReducer = createReducer(
    initialUserTableState,
    on(setInitialTablePreferences, (state, { preferences }) => ({
        ...state,
        preferences
    })),


    on(loadTableUsers, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(loadTableUsersSuccess, (state, { users }) => ({
        ...state,
        loading: false,
        error: null,
        users
    })),
    on(loadTableUsersFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),


    on(updateTablePreferences, (state, { preferences }) => ({
        ...state,
        preferences,
        loading: true,
        error: null
    })),
    on(updateTablePreferencesSuccess, (state) => ({
        ...state,
        loading: false,
        error: null
    })),
    on(updateTablePreferencesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))
);

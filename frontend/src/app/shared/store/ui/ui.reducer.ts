import { createReducer, on } from "@ngrx/store";
import { initialUiState } from "./ui.state";
import { setTheme, toggleTheme, toggleThemeFailure, toggleThemeSuccess } from "./ui.actions";

export const uiReducer = createReducer(
    initialUiState,

    on(setTheme, (state, { isDarkTheme }) => ({
        ...state,
        isDarkTheme,
        loading: false,
        error: null    
    })),

    on(toggleTheme, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(toggleThemeSuccess, (state, { isDarkTheme }) => ({
        ...state,
        isDarkTheme,
        loading: false,
        error: null
    })),

    on(toggleThemeFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
);
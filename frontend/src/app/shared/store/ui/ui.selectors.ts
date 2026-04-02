import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UiState } from "./ui.state";

export const UI_FEATURE_KEY = 'ui';

const selectUiState = createFeatureSelector<UiState>(UI_FEATURE_KEY);

export const selectIsDarkTheme = createSelector(
    selectUiState,
    (uiState) => uiState.isDarkTheme
);

export const selectLoading = createSelector(
    selectUiState,
    (uiState) => uiState.loading
);

export const selectError = createSelector(
    selectUiState,
    (uiState) => uiState.error
);
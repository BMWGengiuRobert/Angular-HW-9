export interface UiState {
  isDarkTheme: boolean;
  loading: boolean;
  error: string | null;
}

export const initialUiState: UiState = {
  isDarkTheme: false,
  loading: false,
  error: null
};
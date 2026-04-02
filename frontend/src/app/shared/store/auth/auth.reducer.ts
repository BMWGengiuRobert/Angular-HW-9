import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import {
  loadCurrentUser,
  loadCurrentUserFailure,
  loadCurrentUserSuccess,
  login,
  loginFailure,
  loginSuccess,
  logout,
  register,
  registerFailure,
  registerSuccess,
  updateCurrentUser,
} from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  // Load Current User
  on(loadCurrentUser, (state) => ({ ...state, loading: true, error: null })),
  on(loadCurrentUserSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    loading: false,
    isInitialized: true,
  })),
  on(loadCurrentUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isInitialized: true,
  })),
  on(updateCurrentUser, (state, { user }) => ({
    ...state,
    currentUser: user,
  })),

  // Login
  on(login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(loginSuccess, (state, { accessToken }) => ({
    ...state,
    accessToken,
    loading: false,
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Register
  on(register, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(registerSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Logout  
  on(logout, (state) => ({
    ...state,
    currentUser: null,
    accessToken: null,
  })),
);

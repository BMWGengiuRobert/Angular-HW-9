import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';
import { LoginDto } from '../../dto/login.dto';
import { RegisterDto } from '../../dto/register.dto';

// Load Current User Actions
export const loadCurrentUser = createAction('[Auth] Load Current User');
export const loadCurrentUserSuccess = createAction(
  '[Auth] Load Current User Success',
  props<{ user: User }>(),
);
export const loadCurrentUserFailure = createAction(
  '[Auth] Load Current User Failure',
  props<{ error: string }>(),
);
export const updateCurrentUser = createAction(
  '[Auth] Update Current User',
  props<{ user: User }>(),
);
export const updateCurrentUserFailure = createAction(
  '[Auth] Update Current User Failure',
  props<{ error: string }>(),
);

// Login Actions
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginDto }>(),
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ accessToken: string }>(),
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>(),
);

// Register Actions
export const register = createAction(
  '[Auth] Register',
  props<{ dto: RegisterDto }>(),
);
export const registerSuccess = createAction(
  '[Auth] Register Success',
);
export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>(),
);

// Logout Action
export const logout = createAction('[Auth] Logout');
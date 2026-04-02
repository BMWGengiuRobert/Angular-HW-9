import { User } from '../../models/user.model';

export interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  accessToken: string | null;
  isInitialized: boolean;
}

export const initialAuthState: AuthState = {
  currentUser: null,
  loading: false,
  error: null,
  accessToken: sessionStorage.getItem('accessToken'),
  isInitialized: false,
};

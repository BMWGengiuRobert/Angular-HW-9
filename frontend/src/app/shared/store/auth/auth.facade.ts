import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadCurrentUser, login, logout, register, updateCurrentUser } from './auth.actions';
import { selectAuthError, selectAuthLoading, selectCurrentUser, selectIsAuthenticated, selectIsAuthInitialized } from './auth.selectors';
import { User } from '../../models/user.model';
import { LoginDto } from '../../dto/login.dto';
import { RegisterDto } from '../../dto/register.dto';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly store = inject(Store);

  readonly currentUser$ = this.store.select(selectCurrentUser);
  readonly loading$ = this.store.select(selectAuthLoading);
  readonly isAuthenticated$ = this.store.select(selectIsAuthenticated);
  readonly error$ = this.store.select(selectAuthError);
  readonly isAuthInitialized$ = this.store.select(selectIsAuthInitialized);

  init(): void {
    this.store.dispatch(loadCurrentUser());
  }

  updateUser(user: User): void {
    this.store.dispatch(updateCurrentUser({ user }));
  }

  login(credentials: LoginDto): void {
    this.store.dispatch(login({ credentials }));
  }

  register(dto: RegisterDto): void {
    this.store.dispatch(register({ dto }));
  }

  logout(): void {
    this.store.dispatch(logout());
  }
}

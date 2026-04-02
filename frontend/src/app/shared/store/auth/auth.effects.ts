import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
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
  updateCurrentUserFailure
} from './auth.actions';
import { User___Service } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly usersService = inject(User___Service);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loadCurrentUser$ = createEffect(() => this.actions$.pipe(
    ofType(loadCurrentUser),
    switchMap(() => {
      const token = sessionStorage.getItem('accessToken');
      if (!token) return of(loadCurrentUserFailure({ error: 'No token' }));

      try {
        const decoded: JwtPayload = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) throw new Error('Token expired');

        if (!decoded.sub) {
          throw new Error('Invalid token payload: missing subject (user ID)');
        }

        const userId = Number(decoded.sub);

        return this.usersService.getUserById(userId).pipe(
          map(user => loadCurrentUserSuccess({ user })),
          catchError(error => of(loadCurrentUserFailure({ error: error.message })))
        );
      } catch (e: any) {
        return of(loadCurrentUserFailure({ error: e.message }));
      }
    })
  ));

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map(response =>
            loginSuccess({ accessToken: response.accessToken })),
          catchError(error =>
            of(loginFailure({ error: error.error?.message || 'Login failed' })))
        ))
    ));

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      tap(({ accessToken }) => {
        sessionStorage.setItem('accessToken', accessToken);
        this.router.navigate(['/network']);
      }),
      map(() => loadCurrentUser()),
    ),
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => {
        sessionStorage.removeItem('accessToken');
        this.router.navigate(['/login']);
      }),
    ), { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(register),
      switchMap(({ dto }) =>
        this.authService.register(dto).pipe(
          map(() => registerSuccess()),
          catchError(error =>
            of(registerFailure({ error: error.error?.message || 'Registration failed' })))
        ))
    ));

  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerSuccess),
      tap(() => {
        this.router.navigate(['/login']);
      }),
    ), { dispatch: false }
  );

  updateCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCurrentUser),
      switchMap(({ user }) =>
        this.usersService.updateUser(user.id, user).pipe(
          catchError(error => {
            console.error('Failed to update user', error);
            return of(updateCurrentUserFailure({ error: error.message }));
          })
        )
      )
    ),
    { dispatch: false }
  );
}

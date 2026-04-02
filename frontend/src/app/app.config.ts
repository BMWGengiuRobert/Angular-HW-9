import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection, isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { angularIcon, cssIcon, gitIcon, htmlIcon, javascriptIcon, nestjsIcon, nodejsIcon, rxjsIcon, sqlIcon, typescriptIcon } from './shared/assets/icons';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AUTH_FEATURE_KEY } from './shared/store/auth/auth.selectors';
import { authReducer } from './shared/store/auth/auth.reducer';
import { AuthEffects } from './shared/store/auth/auth.effects';
import { UI_FEATURE_KEY } from './shared/store/ui/ui.selectors';
import { uiReducer } from './shared/store/ui/ui.reducer';
import { UiEffects } from './shared/store/ui/ui.effects';
import { USER_TABLE_FEATURE_KEY } from './shared/store/user-table/user-table.selectors';
import { userTableReducer } from './shared/store/user-table/user-table.reducer';
import { UserTableEffects } from './shared/store/user-table/user-table.effects';
import { take } from 'rxjs/internal/operators/take';
import { filter } from 'rxjs/internal/operators/filter';
import { AuthFacade } from './shared/store/auth/auth.facade';

const icons = [
  { name: 'angular-custom', svg: angularIcon },
  { name: 'javascript-custom', svg: javascriptIcon },
  { name: 'typescript-custom', svg: typescriptIcon },
  { name: 'nestjs-custom', svg: nestjsIcon },
  { name: 'nodejs-custom', svg: nodejsIcon },
  { name: 'rxjs-custom', svg: rxjsIcon },
  { name: 'html-custom', svg: htmlIcon },
  { name: 'css-custom', svg: cssIcon },
  { name: 'sql-custom', svg: sqlIcon },
  { name: 'git-custom', svg: gitIcon }
]

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideCustomIcons(),
    provideAuthInitialization(),
    provideStore({
      [AUTH_FEATURE_KEY]: authReducer,
      [UI_FEATURE_KEY]: uiReducer,
      [USER_TABLE_FEATURE_KEY]: userTableReducer
    }),
    provideEffects(AuthEffects, UiEffects, UserTableEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: false })
  ],
};

export function provideCustomIcons() {
  return provideAppInitializer(() => {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    icons.forEach((icon) => {
      iconRegistry.addSvgIconLiteral(icon.name,
        sanitizer.bypassSecurityTrustHtml(icon.svg));
    });
  });
}

export function provideAuthInitialization() {
  return provideAppInitializer(() => {
    const authFacade = inject(AuthFacade);
    authFacade.init();

    // The function completes when this observable completes
    // meaning the logic in the auth store sets "isAuthInitialized" to true
    return authFacade.isAuthInitialized$.pipe(
      filter((isAuthInitialized: boolean) => isAuthInitialized === true),
      take(1)
    );
  });
}

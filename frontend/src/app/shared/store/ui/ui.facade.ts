import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { toggleTheme } from "./ui.actions";
import { selectError, selectIsDarkTheme, selectLoading } from "./ui.selectors";

@Injectable({ providedIn: 'root' })
export class UiFacade {
    private readonly store = inject(Store);

    public readonly isDarkTheme$ = this.store.select(selectIsDarkTheme);
    public readonly isDarkThemeLoading$ = this.store.select(selectLoading);
    public readonly errorDarkTheme$ = this.store.select(selectError);

    public toggleTheme(): void {
        this.store.dispatch(toggleTheme());
    }
}
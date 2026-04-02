import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { User } from '../../models/user.model';
import { AvatarComponent } from '../avatar/avatar.component';
import { Router } from '@angular/router';
import { HighlightDirective } from '../../directives/highlight-directive/highlight.directive';
import { TechIconsDirective } from '../../directives/tech-icons-direcitive/tech-icons.directive';
import { UserTableFacade } from '../../store/user-table/user-table.facade';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { TablePreferences } from '../../models/table-preferences.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-network-table',
  imports: [
    MatTableModule, MatIcon, AvatarComponent, HighlightDirective, TechIconsDirective,
    MatProgressBarModule, AsyncPipe, ReactiveFormsModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule
  ],
  templateUrl: './network-table.component.html',
  styleUrl: './network-table.component.scss',
})

export class NetworkTableComponent implements OnInit, OnDestroy {
  public readonly displayedColumns: string[] = ['name', 'headline', 'location', 'connections'];
  public users: User[] = []
  public selectedUser: User | null = null;

  private readonly router = inject(Router)
  private readonly userTableFacade = inject(UserTableFacade);

  public readonly users$ = this.userTableFacade.usersTable$;
  public readonly loading$ = this.userTableFacade.loadingUsersTable$;
  public readonly error$ = this.userTableFacade.errorUsersTable$;
  public readonly preferences$ = this.userTableFacade.preferencesUsersTable$;

  public searchControl = new FormControl('');
  private currentPreferences: TablePreferences | null = null;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.userTableFacade.getUsersTable();

    this.preferences$.pipe(takeUntil(this.destroy$)).subscribe(prefs => {
      if (prefs) {
        this.currentPreferences = prefs;
        if (this.searchControl.value !== prefs.searchFilter) {
          this.searchControl.setValue(prefs.searchFilter, { emitEvent: false });
        }
      }
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      if (this.currentPreferences) {

        const newPrefs: TablePreferences = {
          ...this.currentPreferences,
          searchFilter: searchTerm || '',
          pagination: { ...this.currentPreferences.pagination, pageNumber: 1 }
        };

        this.userTableFacade.updatePreferences(newPrefs);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    if (this.currentPreferences) {

      const newPrefs: TablePreferences = {
        ...this.currentPreferences,
        pagination: { pageSize: event.pageSize, pageNumber: event.pageIndex + 1 }
      };

      this.userTableFacade.updatePreferences(newPrefs);
    }
  }

  goToUserProfile(userId: number) {
    this.router.navigate(['/profile', userId])
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

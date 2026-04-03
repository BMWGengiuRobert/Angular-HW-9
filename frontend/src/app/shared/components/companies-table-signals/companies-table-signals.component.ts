import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, computed, inject, Signal, signal } from '@angular/core';
import { Company } from '../../models/company.model';
import { CompaniesQuery, CompaniesService } from '../../services/company.service';
import { debounceTime, startWith, switchMap, tap } from 'rxjs';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { PaginatedResponse } from '../../models/pagination.model';

@Component({
  selector: 'app-companies-table-signals',
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatInputModule, MatChipsModule,
    MatFormFieldModule, MatIconModule, ReactiveFormsModule, MatProgressBarModule
  ],
  templateUrl: './companies-table-signals.component.html',
  styleUrl: './companies-table-signals.component.scss',
})
export class CompaniesTableSignalsComponent {
  readonly displayedColumns: string[] = ['company', 'location', 'website', 'open jobs'];

  private readonly companiesService = inject(CompaniesService);

  searchControl = new FormControl('');

  pageIndexSignal = signal<number>(0);
  pageSizeSignal = signal<number>(10);
  searchControlSignal = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      tap(() => this.pageIndexSignal.set(0)),
      startWith('')
    )
  );
  querySignal = computed<CompaniesQuery>(() => ({
    search: this.searchControlSignal() || '',
    page: this.pageIndexSignal() + 1,
    limit: this.pageSizeSignal(),
  }));

  responseFromService: Signal<PaginatedResponse<Company>> = toSignal(
    toObservable(this.querySignal).pipe(
      switchMap(query =>
        this.companiesService.getAll(query)
      ),
      startWith({ data: [], pagination: { totalItems: 0, totalPages: 0, currentPage: 0, itemsPerPage: 10 } })
    ),
    { requireSync: true }
  );

  companiesSignal = computed<Company[]>(() => this.responseFromService().data ?? []);
  totalItemsSignal = computed<number>(() => this.responseFromService().pagination.totalItems ?? 0);
  isLoadingSignal = computed<boolean>(() => !this.responseFromService().data);
  isEmptySignal = computed<boolean>(() => this.companiesSignal().length === 0);


  onPageChange(event: PageEvent) {
    this.pageIndexSignal.set(event.pageIndex);
    this.pageSizeSignal.set(event.pageSize);
  }

  onClearSearch() {
    this.searchControl.setValue('');
    this.pageIndexSignal.set(0);
  }

}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CompaniesQuery, CompaniesService } from '../../services/company.service';
import { Company } from '../../models/company.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-companies-table',
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatInputModule, MatChipsModule,
    MatFormFieldModule, MatIconModule, ReactiveFormsModule, MatProgressBarModule
  ],
  templateUrl: './companies-table.component.html',
  styleUrl: './companies-table.component.scss',
})
export class CompaniesTableComponent implements OnInit, OnDestroy {
  public readonly displayedColumns: string[] = ['company', 'location', 'website', 'open jobs'];
  public companies: Company[] = [];
  public searchControl = new FormControl('');
  public isLoading: boolean = false;
  public totalItems: number = 0;
  public pageIndex: number = 0;
  public pageSize: number = 10;

  private readonly destroy$ = new Subject<void>();

  private readonly companiesService = inject(CompaniesService)

  ngOnInit(): void {
    this.loadCompanies();

    this.searchControl.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.pageIndex = 0;
      this.loadCompanies();
    });
  }

  loadCompanies() {
    this.isLoading = true;

    const query: CompaniesQuery = {
      search: this.searchControl.value ?? '',
      page: this.pageIndex + 1,
      limit: this.pageSize,
    };

    this.companiesService.getAll(query).subscribe({

      next: (response) => {
        this.companies = response.data;
        this.totalItems = response.pagination.totalItems;
        this.isLoading = false;
      },

      error: (err) => {
        console.error('Error loading companies:', err);
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCompanies();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

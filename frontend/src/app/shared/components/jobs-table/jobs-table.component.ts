import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs/internal/Subject';
import { JobsQuery, JobsService } from '../../services/job.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Job } from '../../models/job.model';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-jobs-table',
   imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatInputModule, MatChipsModule,
    MatFormFieldModule, MatIconModule, ReactiveFormsModule, MatProgressBarModule
  ],
  templateUrl: './jobs-table.component.html',
  styleUrl: './jobs-table.component.scss',
})
export class JobsTableComponent implements OnInit, OnDestroy {
  public readonly displayedColumns: string[] = ['job', 'location', 'type', 'posted'];
  public jobs: Job[] = [];
  public searchControl = new FormControl('');
  public isLoading: boolean = false;
  public totalItems: number = 0;
  public pageIndex: number = 0;
  public pageSize: number = 10;

  private readonly destroy$ = new Subject<void>();

  private readonly jobsService = inject(JobsService)

  ngOnInit(): void {
    this.loadJobs();

    this.searchControl.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.pageIndex = 0;
      this.loadJobs();
    });
  }

  loadJobs() {
    this.isLoading = true;

    const query: JobsQuery = {
      search: this.searchControl.value || undefined,
      page: this.pageIndex + 1,
      limit: this.pageSize,
    };

    this.jobsService.getAll(query).subscribe({

      next: (response) => {
        this.jobs = response.data;
        this.totalItems = response.pagination.totalItems;
        this.isLoading = false;
      },

      error: (err) => {
        console.error('Error loading jobs:', err);
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadJobs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

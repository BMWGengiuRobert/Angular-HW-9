import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { JobsTableComponent } from './jobs-table.component';
import { JobsQuery, JobsService } from '../../services/job.service';
import { Observable, of } from 'rxjs';
import { PaginatedResponse } from '../../models/pagination.model';
import { Job } from '../../models/job.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

class MockJobService {
  getAll(query: JobsQuery = {}): Observable<PaginatedResponse<Job>> {
    return of({
      data: [],
      pagination: {
        totalItems: 1,
        itemsPerPage: 10,
        currentPage: 1,
        totalPages: 1,
      },
    });
  }
}

describe('JobsTableComponent', () => {
  let component: JobsTableComponent;
  let fixture: ComponentFixture<JobsTableComponent>;
  let service: MockJobService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        JobsTableComponent,
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatProgressBarModule,
      ],
      providers: [{ provide: JobsService, useClass: MockJobService }],
    });

    fixture = TestBed.createComponent(JobsTableComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(JobsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAll() on component init with no arguments', () => {
    vi.spyOn(service, 'getAll');

    fixture.detectChanges();

    expect(service.getAll).toHaveBeenCalledWith({
      search: undefined,
      page: 1,
      limit: 10,
    });
  });

  it('should data$ (response of getAll()) emits the paginated response returned by the mock', () => {
    vi.spyOn(service, 'getAll');

    fixture.detectChanges();

    expect(service.getAll).toHaveBeenCalled();
    expect(component.jobs.length).toBe(0);
    expect(component.totalItems).toBe(1);
  });

  it('should render in the DOM the search input field', () => {
    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[placeholder="Ex. \'Software Engineer\'"]',
    );
    expect(inputElement).toBeTruthy();
  });

  it('should onPageChange() calls getAll() with the new page and limit', () => {
    vi.spyOn(service, 'getAll');

    component.onPageChange({ pageIndex: 2, pageSize: 20, length: 0 });

    expect(service.getAll).toHaveBeenCalledWith({
      search: undefined,
      page: 3,
      limit: 20,
    });
  });

  it('should not An empty search value passes undefined as search (not an empty string) to getAll()', () => {
    vi.spyOn(service, 'getAll');

    component.searchControl.setValue('');
    component.loadJobs();
    expect(service.getAll).toHaveBeenCalledWith({
      search: undefined,
      page: 1,
      limit: 10,
    });
  });

  // it('should not call getAll() a second time during init if the search control hasnt changed', fakeAsync(() => {
  //   vi.spyOn(service, 'getAll');

  //   fixture.detectChanges();

  //   tick(800);

  //   expect(service.getAll).toHaveBeenCalledTimes(1);
  // }));

  it('should not call getAll() a second time during init if the search control hasnt changed', () => {
    vi.useFakeTimers();

    vi.spyOn(service, 'getAll');
    fixture.detectChanges();

    vi.advanceTimersByTime(800);

    expect(service.getAll).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});

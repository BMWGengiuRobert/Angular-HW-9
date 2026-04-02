import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IfCurrentUserDirective } from "./if-current-user.directive";
import { Component } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AuthFacade } from "../store/auth/auth.facade";

@Component({
    imports: [IfCurrentUserDirective],
    template: '<div *appIfCurrentUser="targetId" class="test-element">visible</div>' 
})
class HostComponent {
    targetId: number | undefined | null = null;
}

describe('IfCurrentUserDirective', () => {

    let fixture: ComponentFixture<HostComponent>;
    let hostComponent: HostComponent;
    let currentUserSubject: BehaviorSubject<{ id: number } | null>;

    beforeEach(async () => {
        currentUserSubject = new BehaviorSubject<{ id: number } | null>(null);

        const mockAuthFacade = {
            currentUser$: currentUserSubject.asObservable()
        };

        await TestBed.configureTestingModule({
            imports: [HostComponent],
            providers: [{ provide: AuthFacade, useValue: mockAuthFacade }]
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        hostComponent = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(hostComponent).toBeTruthy();
    });

    it('should render the template when appIfCurrentUser matches the current user ID', () => {
        fixture.detectChanges();

        hostComponent.targetId = 1;
        currentUserSubject.next({ id: 1 });

        fixture.detectChanges();

        const element = fixture.nativeElement.querySelector('.test-element');
        expect(element).toBeTruthy();
        expect(element.textContent.trim()).toBe('visible');
    });

    it('should not render the template when appIfCurrentUser does not match the current user ID', () => {
        fixture.detectChanges();

        hostComponent.targetId = 1;
        currentUserSubject.next({ id: 2 });

        fixture.detectChanges();

        const element = fixture.nativeElement.querySelector('.test-element');
        expect(element).toBeNull();
    });

    it('should clear and re-evaluate the view when the current user changes in the store', () => {
        fixture.detectChanges();

        hostComponent.targetId = 1;
        currentUserSubject.next({ id: 1 });

        fixture.detectChanges();

        const element = fixture.nativeElement.querySelector('.test-element');
        expect(element).toBeTruthy();
        expect(element.textContent.trim()).toBe('visible');

        currentUserSubject.next({ id: 2 });
        fixture.detectChanges();

        const updatedElement = fixture.nativeElement.querySelector('.test-element');
        expect(updatedElement).toBeNull();

        currentUserSubject.next({ id: 1 });
        fixture.detectChanges();

        const restoredElement = fixture.nativeElement.querySelector('.test-element');
        expect(restoredElement).toBeTruthy();
        expect(restoredElement.textContent.trim()).toBe('visible');
    });
});
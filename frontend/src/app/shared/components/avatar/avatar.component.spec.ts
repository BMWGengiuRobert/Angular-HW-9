import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AvatarComponent } from "./avatar.component";

describe('AvavatarComponent', () => {

    let component: AvatarComponent;
    let fixture: ComponentFixture<AvatarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AvatarComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AvatarComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });

    it('should return correct uppercase initials for "John Doe"', () => {
        component.firstName = 'John';
        component.lastName = 'Doe';
        expect(component.initials).toBe('JD');
    });

    it('should return correct uppercase initials for "Alice Smith"', () => {
        component.firstName = 'Alice';
        component.lastName = 'Smith';
        expect(component.initials).toBe('AS');
    });

    it('should return correct uppercase initials for "Jhon"', () => {
        component.firstName = 'Jhon';
        component.lastName = '';
        expect(component.initials).toBe('J');
    });

    it('should return correct uppercase initials for "Doe"', () => {
        component.firstName = '';
        component.lastName = 'Doe';
        expect(component.initials).toBe('D');
    });

    it('should handle single-character names', () => {
        component.firstName = 'j';
        component.lastName = 'd';
        expect(component.initials).toBe('JD');
    });

    it('should render correct initials in DOM', () => {
        component.firstName = 'jhon';
        component.lastName = 'doe';

        fixture.detectChanges();

        const avatarElement: HTMLElement = fixture.nativeElement.querySelector('.avatar');

        expect(avatarElement.textContent?.trim()).toBe('JD');
    });

    it('should return correct dimensions for small, medium and large sizes', () => {
        component.size = 'small';
        expect(component.sizeStyles).toEqual({ width: '32px', height: '32px', fontSize: '14px' });


        component.size = 'medium';
        expect(component.sizeStyles).toEqual({ width: '48px', height: '48px', fontSize: '18px' });

        component.size = 'large';
        expect(component.sizeStyles).toEqual({ width: '64px', height: '64px', fontSize: '24px' });
    });

    it('should fall back to medium size styles if an invalid size is provided', () => {
        component.size = 'invalid' as unknown as 'small' | 'medium' | 'large';
        expect(component.sizeStyles).toEqual({ width: '48px', height: '48px', fontSize: '18px' });
    });

    it('should return correct background color style', () => {
        expect(component.backgroundStyles).toEqual({ backgroundColor: '#0a66c2' });
    });

});
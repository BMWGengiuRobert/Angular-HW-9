import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  @Input() public firstName: string = '';
  @Input() public lastName: string = '';

  @Input() public size?: 'small' | 'medium' | 'large' = 'medium';
  @Input() public backgroundColor?: string = '#0a66c2';

  get initials(): string {
    const firstInitial = this.firstName.charAt(0).toUpperCase();
    const lastInitial = this.lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }

  get sizeStyles() {
    switch (this.size) {
      case 'small':
        return { width: '32px', height: '32px', fontSize: '14px' };
      case 'medium':
        return { width: '48px', height: '48px', fontSize: '18px' };
      case 'large':
        return { width: '64px', height: '64px', fontSize: '24px' };
      default:
        return { width: '48px', height: '48px', fontSize: '18px' };
    }
  }

  get backgroundStyles() {
    return { backgroundColor: this.backgroundColor };
  }

}

import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { UsersService } from '../../services/users.service';
import { AvatarComponent } from '../avatar/avatar.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { User } from '../../models/user.model';
import { UiFacade } from '../../store/ui/ui.facade';
import { AuthFacade } from '../../store/auth/auth.facade';

@Component({
  selector: 'app-header',
  imports: [CommonModule, AvatarComponent, MatMenuModule, MatButtonModule, MatIcon, RouterLink, MatTableModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly service = inject(UsersService);
  private readonly router = inject(Router)

  private readonly authFacade = inject(AuthFacade);
  private readonly uiFacade = inject(UiFacade);

  public readonly currentUser$ = this.authFacade.currentUser$;
  public readonly isDarkTheme$ = this.uiFacade.isDarkTheme$;

  public user: User | null = null;

  goToSettings() {
    this.router.navigate(['/settings'])
  }

  toggleTheme(): void {
    this.uiFacade.toggleTheme();
  }
}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UsersService } from '../../services/users.service';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../models/user.model';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { InfoIconDirective } from '../../directives/info-icon-directive/info-icon.directive';
import { MatIconModule } from '@angular/material/icon';
import { SaveButtonDirective } from '../../directives/save-button-directive/save-button.directive';
import { AuthFacade } from '../../store/auth/auth.facade';
import { Subscription } from 'rxjs';

const URL_PATTERN = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/;
const PHONE_PATTERN = /^[+]?[0-9 \-().]{7,20}$/;

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatCardModule, MatButtonModule, MatSnackBarModule, InfoIconDirective, MatIconModule, SaveButtonDirective],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UsersService);
  private readonly authFacade = inject(AuthFacade);

  public currentUser: User | null = null;
  public saveError = false;

  private userSubscription: Subscription | null = null;

  public settingsForm: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    headline: ['', [Validators.required, Validators.maxLength(120)]],
    profileImage: ['', [Validators.pattern(URL_PATTERN)]],
    dateOfBirth: [''],
    location: ['', [Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    phone: ['', [Validators.pattern(PHONE_PATTERN)]],
    website: ['', [Validators.pattern(URL_PATTERN)]],
    about: ['', [Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    this.userSubscription = this.authFacade.currentUser$.subscribe(user => {

      if (user) {
        this.currentUser = user;

        this.settingsForm.setValue({
          firstName: user.firstName,
          lastName: user.lastName,
          headline: user.headline,
          profileImage: user.profileImage ?? '',
          dateOfBirth: user.dateOfBirth,
          location: user.location,
          email: user.email,
          phone: user.phone,
          website: user.website,
          about: user.about,
        });
      }

    });
  }

  onSaveChanges(): void {
    if (this.settingsForm.valid) {
      const currentUserId = this.currentUser?.id;

      if (currentUserId) {
        const updatedUser: User = {
          ...this.currentUser,
          ...this.settingsForm.value
        };

        this.authFacade.updateUser(updatedUser);

      } else {
        console.error('No current user found to update.');
      }

    }
  }

  onCancel(): void {
    if (this.currentUser) {
      this.settingsForm.setValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        headline: this.currentUser.headline,
        profileImage: this.currentUser.profileImage ?? '',
        dateOfBirth: this.currentUser.dateOfBirth,
        location: this.currentUser.location,
        email: this.currentUser.email,
        phone: this.currentUser.phone,
        website: this.currentUser.website,
        about: this.currentUser.about
      });
    }
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
import { Directive, inject, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { AuthFacade } from '../store/auth/auth.facade';
import { Subscription } from 'rxjs/internal/Subscription';

@Directive({
  selector: '[appIfCurrentUser]',
})
export class IfCurrentUserDirective implements OnInit, OnDestroy, OnChanges {
  @Input() appIfCurrentUser?: number;

  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authFacade = inject(AuthFacade);

  private loggedInUserId?: number;
  private sub: Subscription = new Subscription();

  ngOnInit(): void {
    this.sub = this.authFacade.currentUser$.subscribe((currentUser) => {
      this.loggedInUserId = currentUser?.id;
      this.updateView();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appIfCurrentUser']) {
      this.updateView();
    }
  }

  updateView() {
    this.viewContainer.clear();

    if (this.appIfCurrentUser === this.loggedInUserId) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

import { Component } from '@angular/core';
import { BreadcrumbService } from '../services/breadcrumb.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav
      aria-label="breadcrumb"
      *ngIf="breadcrumbService.breadcrumbs.length > 0"
      class="d-flex align-items-center"
    >
      <ol class="breadcrumb m-0">
        <li
          *ngFor="let breadcrumb of breadcrumbService.breadcrumbs; let last = last"
          class="breadcrumb-item"
          [class.active]="last"
          [attr.aria-current]="last ? 'page' : null"
        >
          <ng-container *ngIf="!last">
            <a [routerLink]="breadcrumb.url">{{ breadcrumb.label }}</a>
          </ng-container>
          <ng-container *ngIf="last">
            {{ breadcrumb.label }}
          </ng-container>
        </li>
      </ol>
    </nav>
  `,
})
export class BreadcrumbComponent {
  constructor(public breadcrumbService: BreadcrumbService) {}
}

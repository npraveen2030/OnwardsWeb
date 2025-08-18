// autocomplete.component.ts
import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http';
import { LeaveManagementService } from '../../services/leavemanagement.service';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
  template: `
    <div class="position-relative" (keydown)="onKeydown($event)">
      <input
        type="text"
        class="form-control"
        [placeholder]="placeholder"
        [value]="value"
        (input)="onInput($event)"
        (focus)="open = true"
        (blur)="closeSoon()"
        [disabled]="disabled"
      />

      <div
        class="dropdown-menu w-100 shadow"
        [class.show]="open && filtered.length"
      >
        <button
          type="button"
          class="dropdown-item"
          *ngFor="let opt of filtered; let i = index"
          [class.active]="i === activeIndex"
          (mousedown)="select(opt)"
        >
          {{ opt }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .dropdown-menu {
        max-height: 240px;
        overflow: auto;
      }
    `,
  ],
})
export class AutocompleteComponent implements ControlValueAccessor {
  @Input() placeholder = `Employees to be Notified`;

  value = '';
  open = false;
  activeIndex = -1;
  disabled = false;

  filtered: string[] = [];
  private input$ = new Subject<string>();

  constructor(private svc: LeaveManagementService) {
    this.input$
      .pipe(
        startWith(''),
        map((raw) => this.extractTwoTerms(raw)),
        // require >= 3 non-space chars and at least one term present
        filter(({ first, second }) => {
          const termLen = first.length + second.length;
          return termLen >= 4; // require at least 4 characters across both terms
        }),
        // don't re-query for the exact same pair
        distinctUntilChanged(
          (a, b) => a.first === b.first && a.second === b.second
        ),
        debounceTime(200),
        switchMap(({ first, second }) => this.svc.search(first, second))
      )
      .subscribe((results) => {
        this.filtered = results ?? [];
        this.open = this.filtered.length > 0;
        this.activeIndex = this.filtered.length ? 0 : -1;
      });
  }

  // ---- CVA ----
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: string | null): void {
    this.value = v ?? '';
    this.input$.next(this.value); // also trigger search on programmatic set
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // ---- UI ----
  onInput(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    this.value = v;
    this.onChange(v);
    this.input$.next(v);

    const { first, second } = this.extractTwoTerms(v);
    const termLen = first.length + second.length;

    if (termLen < 4) {
      this.filtered = [];
      this.open = false;
      this.activeIndex = -1;
    }
  }

  select(opt: string) {
    this.value = opt;
    this.onChange(opt);
    this.onTouched();
    this.open = false;
    this.activeIndex = -1;
  }

  closeSoon() {
    this.open = false;
    this.onTouched();
  }

  onKeydown(e: KeyboardEvent) {
    const items = this.filtered;
    if (!items?.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.activeIndex = (this.activeIndex + 1) % items.length;
      this.open = true;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.activeIndex =
        (this.activeIndex <= 0 ? items.length : this.activeIndex) - 1;
      this.open = true;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.activeIndex >= 0) this.select(items[this.activeIndex]);
    } else if (e.key === 'Escape') {
      this.open = false;
    }
  }

  private extractTwoTerms(raw: string) {
    const trimmed = (raw ?? '').trim();
    if (!trimmed) return { raw: '', first: '', second: '' };

    const [firstRaw, rest = ''] = trimmed.split(/\s+/, 2);
    const [secondRaw = ''] = rest.split(/\s+/, 1);

    return {
      raw,
      first: firstRaw.toLowerCase(),
      second: secondRaw.toLowerCase(),
    };
  }
}

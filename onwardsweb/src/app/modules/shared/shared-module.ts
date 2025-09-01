import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  exports: [CommonModule, FormsModule, ReactiveFormsModule], // ✅ re-export
})
export class SharedModule {}

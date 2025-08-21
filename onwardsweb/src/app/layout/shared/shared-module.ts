import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  exports: [CommonModule, FormsModule] // ✅ re-export
})
export class SharedModule {}

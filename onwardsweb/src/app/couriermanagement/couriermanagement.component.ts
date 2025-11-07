import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Courier, CourierUser } from '../models/CourierModel';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { CourierService } from '../services/courier.service';
import { LoginResponse } from '../models/loginResponseModel';

@Component({
  selector: 'app-couriermanagement',
  standalone: true,
  imports: [TableModule, AutoComplete, ReactiveFormsModule, CommonModule],
  templateUrl: './couriermanagement.component.html',
  styleUrl: './couriermanagement.component.scss',
})
export class CouriermanagementComponent {
  couriers: any;
  users: CourierUser[] = [];
  noDataMessage: string = '';
  usersuggestions: CourierUser[] = [];
  insertorupdatecouriermodal: any;
  CourierForm!: FormGroup;
  isInsert: boolean = true;
  userDetails!: LoginResponse;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastr: ToastrService,
    private courierSerive: CourierService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.CourierForm = this.fb.group({
      id: [''],
      userDetails: ['', Validators.required],
      comments: ['', Validators.required],
    });
    this.noDataMessage = environment.noDataMessage;

    if (isPlatformBrowser(this.platformId)) {
      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }
    }

    this.getCouriers();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const insertorupdatecouriermodalEl = document.getElementById('insertorupdatecourier');

      if (insertorupdatecouriermodalEl && bootstrap?.Modal) {
        this.insertorupdatecouriermodal = new bootstrap.Modal(insertorupdatecouriermodalEl);
      }
    }
  }

  getCouriers() {
    this.courierSerive.getCouriers().subscribe({
      next: (res) => {
        this.couriers = res;
      },
    });
  }

  searchuser(event: AutoCompleteCompleteEvent) {
    if (event.query.replace(/\s/g, '').length >= 3) {
      const term = event.query.toLowerCase();

      this.usersuggestions = [
        ...new Set([
          ...this.users.filter((user) => user.employeeCode.toLowerCase().includes(term)),
          ...this.users.filter((user) => user.fullName.toLowerCase().includes(term)),
          ...this.users.filter((user) => user.mobile.toLowerCase().includes(term)),
        ]),
      ];
    } else {
      this.usersuggestions = [];
    }
  }

  addcourierClick() {
    this.isInsert = true;
    this.courierSerive.getUsersForCourier().subscribe({
      next: (res) => {
        this.users = res;
      },
    });
    this.insertorupdatecouriermodal.show();
  }

  updatecourierClick() {
    this.isInsert = false;
    this.courierSerive.getUsersForCourier().subscribe({
      next: (res) => {
        this.users = res;
      },
    });
    this.insertorupdatecouriermodal.show();
  }

  onSubmit() {
    if (this.CourierForm.valid) {
      const payload: Courier = {
        id:
          this.CourierForm.get('id')?.value === '' ? undefined : this.CourierForm.get('id')?.value,
        userId: this.CourierForm.get('userDetails')?.value['id'],
        comments: this.CourierForm.get('comments')?.value,
        statusId: 1, //Recieved
        loginId: this.userDetails.id,
      };
      console.log(payload);
      this.courierSerive.insertOrUpdateCourier(payload).subscribe({
        next: () => {
          this.getCouriers();
          this.closeModal();
        },
      });
    } else {
      this.CourierForm.markAllAsTouched();
    }
  }

  reset() {
    if (this.isInsert) {
      this.CourierForm.reset();
    } else {
    }
  }

  closeModal() {
    this.CourierForm.reset();
    this.insertorupdatecouriermodal.hide();
  }

  isInvalid(controlName: string): boolean {
    const control = this.CourierForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

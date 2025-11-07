import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TableModule } from 'primeng/table';
import { LoginResponse } from '../../models/loginResponseModel';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UserManagementService } from '../../services/usermanagement.service';
import { usermanagementresponse, UserRequest } from '../../models/usermanagementModel';
import { environment } from '../../../environments/environment';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { user, location, role } from '../../models/jobpostresponse';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { JobPostService } from '../../services/jobpost.service';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-usermanagement',
  standalone: true,
  imports: [TableModule, DatePipe, CommonModule, AutoComplete, ReactiveFormsModule, Tooltip],
  templateUrl: './usermanagement.component.html',
  styleUrl: './usermanagement.component.scss',
  providers: [MessageService],
})
export class UsermanagementComponent {
  noDataMessage: string = '';
  userDetails!: LoginResponse;
  isInsert: boolean = true;
  users: usermanagementresponse[] = [];
  insertorupdateusermodal: any;
  deleteusermodal: any;
  AllUsers: user[] = [];
  reportingmanagersuggestions: user[] = [];
  administrativemanagersuggestions: user[] = [];
  employeeForm!: FormGroup;
  locationOptions: location[] = [];
  roleOptions: role[] = [];
  gradeOptions: any;
  departmentOptions: any;
  typeOptions: any;
  shiftOptions: any;
  updatedSelectedUser: any;
  isUnique: boolean = false;
  copiedEmail: string | null = null;
  showPassword = false;
  selectedUserId?: number;
  selectedDeleteUserId?: number;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastr: ToastrService,
    private userMangementservice: UserManagementService,
    private jobPostService: JobPostService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      fullName: ['', Validators.required],
      email: [
        '',
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.duplicateEmailValidator(this.selectedUserId)],
          updateOn: 'change',
        },
      ],
      password: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      location: ['', Validators.required],
      doj: ['', Validators.required],
      dor: [''],
      role: ['', Validators.required],
      grade: ['', Validators.required],
      department: ['', Validators.required],
      type: ['', Validators.required],
      shift: ['', Validators.required],
      reportingManager: ['', Validators.required],
      administrativeManager: ['', Validators.required],
    });

    if (isPlatformBrowser(this.platformId)) {
      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }

      this.noDataMessage = environment.noDataMessage;
      this.getUsers();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const deleteuserEl = document.getElementById('deleteuser');
      const insertorupdateuserEl = document.getElementById('insertorupdateuser');

      if (deleteuserEl && bootstrap?.Modal) {
        this.deleteusermodal = new bootstrap.Modal(deleteuserEl);
      }

      if (insertorupdateuserEl && bootstrap?.Modal) {
        this.insertorupdateusermodal = new bootstrap.Modal(insertorupdateuserEl);
      }
    }
  }

  getUsers() {
    this.userMangementservice.GetUsersForAdmin().subscribe({
      next: (res) => {
        this.users = res;
      },
    });
  }

  copyToClipboard(email: string): void {
    navigator.clipboard.writeText(email).then(() => {
      this.copiedEmail = email;
      setTimeout(() => {
        this.copiedEmail = null;
      }, 1500);
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onClickAddUser(): void {
    forkJoin({
      roles: this.jobPostService.GetRoles(),
      locations: this.jobPostService.Getlocations(),
      users: this.jobPostService.Getusers(),
      grades: this.userMangementservice.GetAllGrades(),
      departments: this.userMangementservice.GetAllDepartments(),
      types: this.userMangementservice.GetAllTypes(),
      shifts: this.userMangementservice.GetAllShifts(),
    }).subscribe({
      next: (result) => {
        this.roleOptions = result.roles;
        this.locationOptions = result.locations;
        this.AllUsers = result.users;
        this.gradeOptions = result.grades;
        this.departmentOptions = result.departments;
        this.typeOptions = result.types;
        this.shiftOptions = result.shifts;
      },
      error: (err) => {
        console.error('Error loading data:', err);
      },
      complete: () => {
        this.isInsert = true;
        this.selectedUserId = undefined;

        const emailControl = this.employeeForm.get('email');
        emailControl?.clearAsyncValidators();
        emailControl?.setAsyncValidators([this.duplicateEmailValidator(this.selectedUserId)]);

        emailControl?.updateValueAndValidity({ emitEvent: false });

        this.insertorupdateusermodal.show();
      },
    });
  }

  onClickupdateUser(user: usermanagementresponse): void {
    forkJoin({
      roles: this.jobPostService.GetRoles(),
      locations: this.jobPostService.Getlocations(),
      users: this.jobPostService.Getusers(),
      grades: this.userMangementservice.GetAllGrades(),
      departments: this.userMangementservice.GetAllDepartments(),
      types: this.userMangementservice.GetAllTypes(),
      shifts: this.userMangementservice.GetAllShifts(),
    }).subscribe({
      next: (result) => {
        this.roleOptions = result.roles;
        this.locationOptions = result.locations;
        this.AllUsers = result.users;
        this.gradeOptions = result.grades;
        this.departmentOptions = result.departments;
        this.typeOptions = result.types;
        this.shiftOptions = result.shifts;
      },
      error: (err) => {
        console.error('Error loading data:', err);
      },
      complete: () => {
        this.isInsert = false;
        this.selectedUserId = user.id;
        this.updatedSelectedUser = user;
        this.employeeForm.patchValue({
          fullName: user.fullName,
          email: user.email,
          password: user.password,
          mobile: user.mobile,
          doj: user.doj.split('T')[0],
          dor: user.dor?.split('T')[0],
          location: user.locationId,
          role: user.roleId,
          grade: user.gradeId,
          department: user.departmentId,
          type: user.userTypeId,
          shift: user.shiftId,
          reportingManager: { id: user.reportingManagerId, userName: user.reportingManagerName },
          administrativeManager: {
            id: user.administrativeManagerId,
            userName: user.administrativeManagerName,
          },
        });

        console.log('shiftId:' + user.shiftId);

        const emailControl = this.employeeForm.get('email');
        emailControl?.clearAsyncValidators();
        emailControl?.setAsyncValidators([this.duplicateEmailValidator(this.selectedUserId)]);

        emailControl?.updateValueAndValidity({ emitEvent: false });

        this.insertorupdateusermodal.show();
      },
    });
  }

  duplicateEmailValidator(userId?: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value?.trim();
      if (!email) return of(null);

      return of(email).pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value) =>
          this.userMangementservice.checkDuplicateEmail(value, userId).pipe(
            map((isUnique) => {
              console.log('Email Check Result:', isUnique);
              return isUnique ? null : { emailTaken: true };
            }),
            catchError(() => of(null))
          )
        )
      );
    };
  }

  // Auto-Complete
  searchreportingmanager(event: AutoCompleteCompleteEvent) {
    if (event.query.replace(/\s/g, '').length >= 3) {
      const terms = event.query.toLowerCase().split(/\s+/).filter(Boolean);

      this.reportingmanagersuggestions = this.AllUsers.filter((user) => {
        const names = user.userName.toLowerCase().split(/\s+/).filter(Boolean);

        return terms.every((term, index) => {
          return !names[index] || names[index].includes(term);
        });
      });
    } else {
      this.reportingmanagersuggestions = [];
    }
  }

  searchadministrativemanager(event: AutoCompleteCompleteEvent) {
    if (event.query.replace(/\s/g, '').length >= 3) {
      const terms = event.query.toLowerCase().split(/\s+/).filter(Boolean);

      this.administrativemanagersuggestions = this.AllUsers.filter((user) => {
        const names = user.userName.toLowerCase().split(/\s+/).filter(Boolean);

        return terms.every((term, index) => {
          return !names[index] || names[index].includes(term);
        });
      });
    } else {
      this.administrativemanagersuggestions = [];
    }
  }

  get email() {
    return this.employeeForm.get('email');
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;

      const payload: UserRequest = {
        id: this.isInsert ? null : this.selectedUserId,
        loginId: formValue.loginId,
        password: formValue.password,
        fullName: formValue.fullName,
        email: formValue.email,
        mobile: formValue.mobile,
        locationId: formValue.location,
        doj: formValue.doj,
        dor: formValue.dor ?? null,
        roleId: formValue.role,
        gradeId: formValue.grade,
        departmentId: formValue.department,
        userTypeId: formValue.type,
        shiftId: formValue.shift,
        reportingManagerId: formValue.reportingManager?.id ?? null,
        administrativeManagerId: formValue.administrativeManager?.id ?? null,
      };

      this.userMangementservice.InsertOrUpdateUser(payload).subscribe({
        next: (res) => {
          this.getUsers();
          this.cancelForm();
        },
        error: (err) => console.error('Error:', err),
      });
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  onDeleteclick(id: number): void {
    this.selectedDeleteUserId = id;
    this.deleteusermodal.show();
  }

  onDelete() {
    this.userMangementservice
      .DeleteUser(this.selectedDeleteUserId ?? 0, this.userDetails.id)
      .subscribe({
        next: () => {
          this.getUsers();
          this.deleteusermodal.hide();
        },
        error: (err) => {
          throw new Error(err.message);
        },
      });
  }

  InsertresetForm() {
    this.employeeForm.reset({
      location: '',
      role: '',
      grade: '',
      department: '',
      type: '',
      shift: '',
    });
  }

  updateresetForm() {
    this.employeeForm.reset({
      fullName: this.updatedSelectedUser.fullName,
      email: this.updatedSelectedUser.email,
      password: this.updatedSelectedUser.password,
      mobile: this.updatedSelectedUser.mobile,
      doj: this.updatedSelectedUser.doj.split('T')[0],
      dor: this.updatedSelectedUser.dor.split('T')[0],
      location: this.updatedSelectedUser.locationId,
      role: this.updatedSelectedUser.roleId,
      grade: this.updatedSelectedUser.gradeId,
      department: this.updatedSelectedUser.departmentId,
      type: this.updatedSelectedUser.userTypeId,
      shift: this.updatedSelectedUser.shiftId,
      reportingManager: {
        id: this.updatedSelectedUser.reportingManagerId,
        userName: this.updatedSelectedUser.reportingManagerName,
      },
      administrativeManager: {
        id: this.updatedSelectedUser.administrativeManagerId,
        userName: this.updatedSelectedUser.administrativeManagerName,
      },
    });
  }

  cancelForm() {
    this.insertorupdateusermodal.hide();
    this.InsertresetForm();
  }

  isInvalid(controlName: string): boolean {
    const control = this.employeeForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

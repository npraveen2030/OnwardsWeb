import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { environment } from '../../../environments/environment';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserScheduleService } from '../../services/user-schedule.service';
import { UserScheduleProfile, UserScheduleTVP } from '../../models/user-schedule.model';
import { LoginResponse } from '../../models/loginResponseModel';
import { TooltipModule } from 'primeng/tooltip';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { JobPostService } from '../../services/jobpost.service';
import { SchedulerProfileService } from '../../services/scheduler-profile.service';

@Component({
  selector: 'app-userschedulemanagement',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    TooltipModule,
    AutoComplete,
    ReactiveFormsModule,
  ],
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulerComponent {
  allTimeSlots = [
    { key: 'h9to10', label: '9–10 AM' },
    { key: 'h10to11', label: '10–11 AM' },
    { key: 'h11to12', label: '11–12 AM' },

    { key: 'h2to3', label: '2–3 PM' },
    { key: 'h3to4', label: '3–4 PM' },
    { key: 'h4to5', label: '4–5 PM' },
    { key: 'h5to6', label: '5–6 PM' },

    { key: 'h6to7', label: '6–7 PM' },
    { key: 'h7to8', label: '7–8 PM' },
    { key: 'h8to9', label: '8–9 PM' },

    { key: 'h9to10pm', label: '9–10 PM' },
    { key: 'h10to11pm', label: '10–11 PM' },
    { key: 'h11to12pm', label: '11–12 PM' },
  ];
  timeSlots: string[] = this.allTimeSlots.map((t) => t.key);

  // Selection state
  isSelecting = false;
  selectedType: number | null = null;
  startIndex: number | null = null;
  endIndex: number | null = null;
  activeRow: string | null = null;

  showDialog = false;
  selectedDate: string | null = null;
  selectedTimes: string[] = [];

  userscheduleprofile: UserScheduleProfile[] = [];
  userDetails!: LoginResponse;
  schedulerForm!: FormGroup;
  saveschedulerprofilemodal!: any;
  skillsuggestions: string[] = [];
  AllSkills: string[] = [];

  constructor(
    private userScheduleService: UserScheduleService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private jobPostService: JobPostService,
    private schedulerProfileService: SchedulerProfileService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.schedulerForm = this.fb.group({
      summaryId: [''],
      summary: ['', Validators.required],
      Skillholder: [''],
      skills: this.fb.array([], Validators.required),
      nonDbSkills: this.fb.array([]),
    });
    if (isPlatformBrowser(this.platformId)) {
      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }

      this.getUserSchedule();
    }
  }
  //saveschedulerprofile

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const saveschedulerprofilemodalEl = document.getElementById('saveschedulerprofile');

      if (saveschedulerprofilemodalEl && bootstrap?.Modal) {
        this.saveschedulerprofilemodal = new bootstrap.Modal(saveschedulerprofilemodalEl);
      }
    }
  }

  getUserSchedule() {
    this.userScheduleService
      .getUserScheduleForScheduler(
        this.userDetails.id,
        this.userDetails.companyId,
        this.userDetails.locationId
      )
      .subscribe({
        next: (res) => {
          this.userscheduleprofile = res;
        },
        complete: () => {
          this.cdr.markForCheck();
        },
      });
  }

  getColorClass(profile: UserScheduleProfile, index: number): string {
    const key = this.timeSlots[index];
    const slot = this.parseSlot((profile as any)[key]);

    if (!slot) return 'unavailable'; // NULL → unavailable
    if (slot.ParticipantId === -1) return 'available'; // -1 → available
    if (slot.ParticipantId > 0) return 'scheduled'; // user ID → scheduled

    return 'unavailable';
  }

  onMouseDown(profile: UserScheduleProfile, timeIndex: number) {
    this.isSelecting = true;
    this.activeRow = profile.date;
    this.startIndex = timeIndex;
    this.endIndex = timeIndex;

    const key = this.timeSlots[timeIndex];
    const slot = this.parseSlot((profile as any)[key]);
    if (!slot.ParticipantId) this.selectedType = 0;
    if (slot.ParticipantId === -1) this.selectedType = -1;
    if (slot.ParticipantId > 0) this.selectedType = 1;

    console.log(this.selectedType);
  }

  /** Hover while selecting */
  onMouseEnter(profile: UserScheduleProfile, timeIndex: number) {
    if (this.isSelecting && this.activeRow === profile.date) {
      const key = this.timeSlots[timeIndex];
      const slot = this.parseSlot((profile as any)[key]);
      let currenttype = 0;
      if (!slot.ParticipantId) currenttype = 0;
      if (slot.ParticipantId === -1) currenttype = -1;
      if (slot.ParticipantId > 0) currenttype = 1;

      console.log(currenttype);

      if (currenttype !== this.selectedType) {
        this.isSelecting = false;
        this.activeRow = null;
        this.startIndex = null;
        this.endIndex = null;
      }

      if (currenttype === this.selectedType) {
        this.endIndex = timeIndex;
      }
    }
  }

  /** Mouse up: Finalize & show dialog */
  @HostListener('document:mouseup')
  onMouseUp() {
    if (this.isSelecting && this.activeRow !== null) {
      const start = Math.min(this.startIndex!, this.endIndex!);
      const end = Math.max(this.startIndex!, this.endIndex!);

      // Store the times using KEYS
      this.selectedTimes = this.timeSlots.slice(start, end + 1);

      this.selectedDate = this.activeRow;
      this.showDialog = true;
    }

    this.isSelecting = false;
    this.activeRow = null;
    this.startIndex = null;
    this.endIndex = null;
  }

  isSelected(date: string, timeIndex: number): boolean {
    if (!this.isSelecting || this.activeRow !== date) return false;
    const start = Math.min(this.startIndex!, this.endIndex!);
    const end = Math.max(this.startIndex!, this.endIndex!);
    return timeIndex >= start && timeIndex <= end;
  }

  confirmSelection() {
    if (!this.selectedDate) {
      console.error('selectedDate is null');
      return;
    }

    const profile = this.userscheduleprofile.find((p) => p.date === this.selectedDate);

    if (!profile) {
      console.error('Profile not found for selected date');
      return;
    }

    const payload: UserScheduleTVP[] = this.selectedTimes.map((slotKey) => {
      const slotJson = this.parseSlot((profile as any)[slotKey]);

      const existingId = slotJson?.ScheduleId ?? null;
      const existingParticipantId = slotJson?.ParticipantId ?? null;
      // ➜ this may be null, -1, or valid UserId: KEEP IT

      return {
        id: existingId,
        schedulerId: this.userDetails.id,
        participantId: existingParticipantId,
        date: this.selectedDate!, // "yyyy-mm-dd"
        startTime: this.convertToTime(slotKey), // "09:00:00"
        loginId: this.userDetails.id,
      };
    });

    console.log(payload);

    this.userScheduleService.insertOrUpdateSchedule(payload).subscribe({
      next: (res) => console.log(res.message),
      error: (err) => console.error(err),
      complete: () => {
        this.getUserSchedule();
      },
    });

    this.showDialog = false;
  }

  convertToTime(slotKey: string): string {
    const timeMap: any = {
      h9to10: '09:00:00',
      h10to11: '10:00:00',
      h11to12: '11:00:00',

      h2to3: '14:00:00',
      h3to4: '15:00:00',
      h4to5: '16:00:00',
      h5to6: '17:00:00',

      h6to7: '18:00:00',
      h7to8: '19:00:00',
      h8to9: '20:00:00',

      h9to10pm: '21:00:00',
      h10to11pm: '22:00:00',
      h11to12pm: '23:00:00',
    };

    return timeMap[slotKey] ?? '00:00:00';
  }

  /** Converts a key to its label */
  getLabel(key: string): string {
    return this.allTimeSlots.find((t) => t.key === key)?.label ?? key;
  }

  formatDate(dateIso: string): string {
    if (!dateIso) return '';
    const [y, m, d] = dateIso.split('T')[0].split('-');
    return `${d}-${m}-${y}`;
  }

  parseSlot(slot: string | null | undefined): any {
    if (!slot) return null;
    try {
      return JSON.parse(slot);
    } catch {
      return null;
    }
  }

  getSubject(profile: UserScheduleProfile, index: number): string {
    const slot = this.parseSlot((profile as any)[this.timeSlots[index]]);
    return slot?.Subject || '';
  }

  getFullName(profile: UserScheduleProfile, index: number): string {
    const slot = this.parseSlot((profile as any)[this.timeSlots[index]]);
    return slot?.FullName || '';
  }

  getTooltip(profile: UserScheduleProfile, index: number): string {
    const slot = this.parseSlot((profile as any)[this.timeSlots[index]]);

    if (slot.ParticipantId > 0)
      return `Booked By: ${slot.FullName}\nSubject: ${slot.Subject}\nComments: ${
        slot.Comments || ''
      }`;

    return '';
  }

  search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.skillsuggestions = this.AllSkills.filter((skill) => skill.toLowerCase().includes(query));
  }

  get skills(): FormArray {
    return this.schedulerForm.get('skills') as FormArray;
  }

  get NonDbSkills(): FormArray {
    return this.schedulerForm.get('NonDbSkills') as FormArray;
  }

  addSkillFromHolder() {
    const skillName = this.schedulerForm.get('Skillholder')?.value;

    this.skills.push(
      this.fb.group({
        skillName: [skillName],
        rating: [0, Validators.min(1)], // ⭐ At least 1 star required
      })
    );

    this.schedulerForm.get('Skillholder')?.reset();
  }

  setRating(index: number, rating: number) {
    this.skills.at(index).get('rating')?.setValue(rating);
    this.skills.at(index).get('rating')?.markAsTouched();
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  onProfileClick() {
    this.schedulerProfileService.getProfile(this.userDetails.id).subscribe({
      next: (res) => {
        // Set Summary
        this.schedulerForm.patchValue({
          summary: res.summary || '',
          summaryId: res.summaryId ?? null,
        });

        // Clear FormArray first
        const skillsArray = this.schedulerForm.get('skills') as FormArray;
        skillsArray.clear();

        // Insert existing skills
        if (res.skills && res.skills.length > 0) {
          res.skills.forEach((s) => {
            skillsArray.push(
              this.fb.group({
                id: [s.id],
                skillName: [s.skillName],
                rating: [s.rating, Validators.min(1)],
              })
            );
          });
        }
      },
      complete: () => {
        this.jobPostService.GetSkills().subscribe({
          next: (res) => {
            this.AllSkills = res.map((item: any) => item.skillName);
          },
          complete: () => {
            this.saveschedulerprofilemodal.show();
          },
        });
      },
    });
  }

  onSave() {
    if (this.schedulerForm.valid) {
      const model = {
        loginId: this.userDetails.id,
        summaryId: this.schedulerForm.get('summaryId')?.value ?? null, // load this when you fetch profile
        summary: this.schedulerForm.get('summary')?.value,
        skills: this.skills.value.map((s: any) => ({
          id: s.id ?? null,
          skillName: s.skillName,
          rating: s.rating,
        })),
      };
      this.schedulerProfileService.saveProfile(model).subscribe({
        next: () => {
          // success logic
          this.saveschedulerprofilemodal.hide();
          this.reset();
        },
      });
    } else {
      this.schedulerForm.markAllAsTouched();
      return;
    }
  }

  reset() {
    const skillsArray = this.schedulerForm.get('skills') as FormArray;
    skillsArray.clear(); // <-- removes all skill rows

    this.schedulerForm.reset();
  }

  cancel() {
    this.schedulerForm.reset();
    this.saveschedulerprofilemodal.hide();
  }

  isInvalid(controlName: string): boolean {
    const control = this.schedulerForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ExitInterviewService } from '../../services/exitinterview.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ExitInterview, UserExitInterview } from '../../models/exitinterviewResopnseModel';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginResponse } from '../../models/loginResponseModel';

@Component({
  selector: 'app-exit-interview',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './exit-interview.component.html',
  styleUrl: './exit-interview.component.scss',
})
export class ExitInterviewComponent {
  ExitInterviewsections = new Set<number>();
  ExitInterviewQuestionsList: Array<Array<ExitInterview>> = [];
  exitInterviewForm!: FormGroup;
  ExitInterview!: Array<ExitInterview>;
  UserExitInterviewAns: Array<UserExitInterview> = [];
  userDetails!: LoginResponse;

  constructor(
    private exitInterviewService: ExitInterviewService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }

      this.exitInterviewService.getExitInterview().subscribe({
        next: (res) => {
          this.ExitInterview = res;
          this.createForm(this.ExitInterview);

          for (const question of this.ExitInterview) {
            this.ExitInterviewsections.add(question.exitInterviewId);
          }
          for (const Id of this.ExitInterviewsections) {
            this.ExitInterviewQuestionsList.push(
              this.ExitInterview.filter((question) => question.exitInterviewId === Id)
            );
          }
        },
      });
    }
  }

  createForm(ExitInterviewQuestions: ExitInterview[]) {
    const formGroupConfig: { [key: string]: FormControl } = {};

    ExitInterviewQuestions.forEach((q) => {
      formGroupConfig[q.id] = new FormControl('', Validators.required);
    });

    this.exitInterviewForm = this.fb.group(formGroupConfig);
  }

  onSubmit() {
    if (this.exitInterviewForm.valid) {
      for (const Ques of this.ExitInterview) {
        this.UserExitInterviewAns.push({
          userId: this.userDetails.id,
          questionId: Ques.id,
          optionId: Ques.hasOptions ? this.exitInterviewForm.get(Ques.id.toString())?.value : null,
          answer: !Ques.hasOptions ? this.exitInterviewForm.get(Ques.id.toString())?.value : null,
          loginId: this.userDetails.id,
        });
      }
      this.exitInterviewService
        .InsertOrUpdateUserExitInterview(this.UserExitInterviewAns)
        .subscribe({
          next: (res) => {
            console.log(res);
          },
          error: (err) => console.log(err),
        });
    } else {
      console.log('invalid');
      this.exitInterviewForm.markAllAsTouched();
    }
  }

  isInvalid(controlName: string, errorName?: string): boolean {
    const control = this.exitInterviewForm.get(controlName);
    if (!control) return false;
    return errorName
      ? control.touched && !!control.errors?.[errorName]
      : control.touched && control.invalid;
  }
}

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginService } from '../services/login-service.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLoginService: jasmine.SpyObj<LoginService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockLoginService = jasmine.createSpyObj('LoginService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        LoginComponent, // standalone component
      ],
      providers: [
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: LoginService, useValue: mockLoginService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with username and password controls', () => {
    expect(component.loginForm.contains('username')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should mark form invalid if username and password are empty', () => {
    component.loginForm.setValue({ username: '', password: '' });
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should navigate to dashboard on successful login', fakeAsync(() => {
    const mockResponse = {
      userDetails: { employeeCode: 'EMP123', name: 'Test User' },
    };

    mockLoginService.login.and.returnValue(of(mockResponse as any));

    component.loginForm.setValue({ username: 'admin', password: '1234' });
    component.onLogin();

    tick();

    expect(sessionStorage.getItem('userDetails')).toContain('EMP123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.errorMessage).toBe('');
  }));

  it('should set error message if login response does not contain employeeCode', fakeAsync(() => {
    const mockResponse = { userDetails: { employeeCode: null } } as any;

    mockLoginService.login.and.returnValue(of(mockResponse));

    component.loginForm.setValue({ username: 'admin', password: '1234' });
    component.onLogin();

    tick();

    expect(component.errorMessage).toBe('Unexpected login response.');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  }));

  it('should set error message on invalid credentials (401)', fakeAsync(() => {
    mockLoginService.login.and.returnValue(throwError(() => ({ status: 401 })));

    component.loginForm.setValue({ username: 'admin', password: 'wrong' });
    component.onLogin();

    tick();

    expect(component.errorMessage).toBe('Invalid username or password.');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  }));

  it('should set generic error message on other errors', fakeAsync(() => {
    mockLoginService.login.and.returnValue(throwError(() => ({ status: 500 })));

    component.loginForm.setValue({ username: 'admin', password: '1234' });
    component.onLogin();

    tick();

    expect(component.errorMessage).toBe('An error occurred. Please try again.');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  }));
});

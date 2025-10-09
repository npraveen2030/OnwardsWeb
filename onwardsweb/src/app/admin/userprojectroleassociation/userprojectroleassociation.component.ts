import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JobPostService } from '../../services/jobpost.service';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { LoginResponse } from '../../models/loginResponseModel';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { project, role, user } from '../../models/jobpostresponse';
import { UserProjectRoleAssociationService } from '../../services/user-project-role-association.service';
import {
  UserProjectRoleAssociationRequest,
  UserProjectRoleAssociationResponse,
} from '../../models/userprojectroleassociationmodel';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-userprojectroleassociation',
  standalone: true,
  imports: [AutoComplete, FormsModule, DatePipe],
  templateUrl: './userprojectroleassociation.component.html',
  styleUrl: './userprojectroleassociation.component.scss',
})
export class UserprojectroleassociationComponent {
  userDetails!: LoginResponse;
  userRoles: role[] = [];
  users: user[] = [];
  projects: project[] = [];
  showAssociations: boolean = false;
  selectedprojectid: string = '';
  deletedassociationid?: number;
  associations: UserProjectRoleAssociationResponse[] = [];
  searchautocomplete: any = {};
  formvalues: any = {};
  noDataMessage: string = '';
  deleteassociationmodal!: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private jobPostService: JobPostService,
    private associatonService: UserProjectRoleAssociationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }

      this.jobPostService.GetRoles().subscribe((res) => {
        const priority = [5, 4];
        this.userRoles = res.sort((a, b) => {
          const indexA = priority.indexOf(a.id);
          const indexB = priority.indexOf(b.id);

          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return 0;
        });
        this.userRoles.forEach((role) => {
          this.formvalues[role.roleName] = '';
          this.searchautocomplete[role.roleName] = [];
        });
      });

      this.jobPostService.Getusers().subscribe((res) => {
        this.users = res;
      });

      this.jobPostService.GetProjects().subscribe((res) => {
        this.projects = res;
      });

      this.noDataMessage = environment.noDataMessage;
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const deleteassociationmodalEl = document.getElementById('deleteassociation');

      if (deleteassociationmodalEl && bootstrap?.Modal) {
        this.deleteassociationmodal = new bootstrap.Modal(deleteassociationmodalEl);
      }
    }
  }

  selectedproject(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.associatonService.getAssociations(parseInt(value, 10)).subscribe({
      next: (res) => {
        this.associations = res;
      },
      error: (err) => {
        this.associations = [];
      },
    });
  }

  getAssociationsByRoleLength(roleId: number) {
    return this.associations.filter((a) => a.roleId === roleId).length;
  }

  getAssociationsByRole(roleId: number) {
    return this.associations.filter((a) => a.roleId === roleId);
  }

  search(event: AutoCompleteCompleteEvent, roleName: string) {
    const query = event.query.toLowerCase();
    this.searchautocomplete[roleName] = this.users.filter((user) =>
      user.userName.toLowerCase().includes(query)
    );
  }

  insertassociation(userId: number, roleId: number, rolename: any) {
    const insertreq: UserProjectRoleAssociationRequest = {
      loginId: this.userDetails.id,
      userId: userId,
      projectId: parseInt(this.selectedprojectid, 10),
      roleId: roleId,
      associationStartDate: new Date().toISOString(),
    };
    this.associatonService.insertAssociation(insertreq).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success(res.message);
        } else {
          this.toastr.warning(res.message);
        }
      },
      error: (err) => {
        throw new Error(err.message);
      },
      complete: () => {
        this.associatonService.getAssociations(parseInt(this.selectedprojectid, 10)).subscribe({
          next: (res) => {
            this.associations = res;
          },
          error: (err) => {
            this.associations = [];
          },
        });
        this.formvalues[rolename] = null;
      },
    });
  }

  deleteAssociationmodal(id: number) {
    this.deletedassociationid = id;
    this.deleteassociationmodal.show();
  }

  deleteAssociation() {
    this.associatonService
      .deleteAssociation(this.deletedassociationid ?? 0, this.userDetails.id)
      .subscribe({
        next: () => {
          this.toastr.success('Association Deleted Successfully');
        },
        error: (err) => {
          throw new Error(err.message);
        },
        complete: () => {
          this.associatonService.getAssociations(parseInt(this.selectedprojectid, 10)).subscribe({
            next: (res) => {
              this.associations = res;
            },
            error: (err) => {
              this.associations = [];
            },
            complete: () => {
              this.deleteassociationmodal.hide();
            },
          });
        },
      });
  }
}

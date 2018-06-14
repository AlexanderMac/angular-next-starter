import * as _                     from 'lodash';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin }               from 'rxjs/observable/forkJoin';
import { NotificationService }    from '../_core/notification.service';
import { UserService }            from './service';
import { RoleService }            from '../roles/service';
import { User }                   from './model';

@Component({
  selector: 'am-user-details',
  templateUrl: './details.component.pug'
})
export class UserDetailsComponent implements OnInit {
  isLoading: boolean;
  isSaving: boolean;
  userId: number;
  user: User;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ntfsSrvc: NotificationService,
    private userSrvc: UserService,
    private roleSrvc: RoleService) {
      this.userId = +this.activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this._loadUser();
  }

  _loadUser(): void {
    this.isLoading = true;
    forkJoin(
      this.roleSrvc.getRoles(),
      this.userSrvc.getUser(this.userId)
    )
    .subscribe(
      ([roles, user]) => {
        user.extendUserByRoleNames(roles);
        this.user = user;
      },
      err => {
        this.ntfsSrvc.error('Unable to load user');
        this.router.navigate(['/users']);
      },
      () => this.isLoading = false
    );
  }
}

import * as _   from 'lodash';
import { Role } from '../roles/model';

export class User {
  id: number;
  name: string;
  email: string;
  roles: number[];
  roleNames: string;

  extendUserByRoleNames(roles: Role[]) {
    this.roleNames = _.chain(this.roles)
      .map(userRoleId => _.find(roles, { id: +userRoleId }))
      .map(role => role ? role.name : '')
      .compact()
      .join(',')
      .value();
  }
}

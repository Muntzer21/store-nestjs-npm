import { Roles } from 'src/utils/common/user-roles.enum';
import {SetMetadata} from '@nestjs/common'
export const RolesUser = (...roles: string[]) => SetMetadata('roles', roles);
// console.log(ro);



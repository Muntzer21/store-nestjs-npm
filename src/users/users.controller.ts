import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignUpDto } from './dto/sign-up-dto';
import { SignInDto } from './dto/sign-in-dto';
import { RolesUser } from './decorators/user-role.decorator';
import { Roles } from 'src/utils/common/user-roles.enum';
import { AuthRolesGuard } from './guards/auth-roles.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import {AuthGuard} from '@nestjs/passport'
import { ChangePasswordDto } from './dto/change-password.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sign-up')
  signup(@Body() signupDto: SignUpDto) {

    return this.usersService.signup(signupDto);
  }

  @Post('sign-in')
  signin(@Body() signupDto: SignInDto) {
    // console.log(req.body);

    return this.usersService.signin(signupDto);
  }

  // @RolesUser(Roles.ADMIN)
  // @UseGuards(AuthRolesGuard)
  @Get('all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('single/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get('current-user')
  @RolesUser(Roles.USER)
  @UseGuards(AuthRolesGuard)
  currentUser(@CurrentUser() user) {
    const user_id = user.id;
    return this.usersService.findOne(user_id);
  }
  // button click then request this end point
  //http://localhost:3000/api/v1/users/google/login
  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  googleLogin(@Req() res: any, @Res() resp: any) {
    return resp;
  }

  // http://localhost:3000/api/v1/users/google/callback
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() res: any) {
    const user = res.user;

    return this.usersService.logGoogle(user);
  }

  @RolesUser(Roles.USER)
  @UseGuards(AuthRolesGuard)
  @Patch('change-password')
  async changePassword(
    @Body() changePaasword: ChangePasswordDto,
    @CurrentUser() currentUser,
  ) {
    const userId = currentUser.id;
    return this.usersService.changePassword(changePaasword, userId);
  }

  // @RolesUser(Roles.USER)
  // @UseGuards(AuthRolesGuard)
  // @Post('forgot-password')
  // forgotPassword(@Body('email') email: string) {
  //   return this.usersService.forgotPassword(email);
  // }
  @RolesUser(Roles.USER)
  @UseGuards(AuthRolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @RolesUser(Roles.ADMIN)
  @UseGuards(AuthRolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

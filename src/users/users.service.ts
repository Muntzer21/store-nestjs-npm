import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up-dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in-dto';
import { JwtService } from '@nestjs/jwt';
import { Cron } from '@nestjs/schedule';
import { EmailService } from './mail/email.service';
import { ChangePasswordDto } from './dto/change-password.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userReposirty: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * to sign up a new user
   * @param signupUserDto body of the request
   * @returns new user in DB
   */
  async signup(signupUserDto: SignUpDto) {
    const user = await this.userReposirty.findOne({
      where: { email: signupUserDto.email },
    });
    if (user) throw new BadRequestException('This user already exists');

    const slat = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(signupUserDto.password, slat);
    signupUserDto.password = hashedPassword;

    let newUser = await this.userReposirty.create(signupUserDto);

    newUser = await this.userReposirty.save(newUser);
    delete newUser.password;

    const accessToken = await this.generateJwt({
      id: newUser.user_id,
      email: newUser.email,
    });

    return { msg: newUser, accessToken };
  }

  /**
   * to sign in an existing user
   * @param signinUserDto body of the request
   * @returns user data and access token
   */
  async signin(signinUserDto: SignInDto) {
    const user = await this.userReposirty
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: signinUserDto.email })
      .getOne();

    if (!user) {
      throw new BadRequestException('This user not exists');
    }

    const isPasswordMatched = await bcrypt.compare(
      signinUserDto.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new BadRequestException('password not matched');
    }
    delete user.password;
    const accessToken = await this.generateJwt({
      id: user.user_id,
      email: user.email,
    });

    // console.log(accessToken);
    
    return { msg: user, accessToken };
  }

  /**
   * to log in with Google
   * @param userGoogle get user data from Google
   * @returns request to call back with user data and access token
   */
  async logGoogle(userGoogle: any) {
    const user = await this.userReposirty.findOne({
      where: { email: userGoogle.profile.email },
    });
    if (!user) {
      const newUser = new User();
      newUser.email = userGoogle.profile.email;
      newUser.password = 'NULL'; // text pox to inter password after the login
      newUser.name = userGoogle.profile.displayName;
      let userDB = this.userReposirty.create(newUser);
      userDB = await this.userReposirty.save(newUser);
      const accessToken = await this.generateJwt({
        id: userDB.user_id,
        email: userDB.email,
      });
      return { accessToken };
    }

    const accessToken = await this.generateJwt({
      id: user.user_id,
      email: user.email,
    });

    return { msg: user, accessToken };
  }

  /**
   * Cron job to send an email every Friday at 12 PM
   */
  @Cron('0 12 * * 5')
  async handleCron() {
    try {
      const users = await this.userReposirty.find();
      users.forEach(async (user) => {
        await this.emailService.sendEmail(
          user.email,
          'sweet friday you have 50% off on all products if you frind to muntazer',
        );
      });
    } catch (error) {
      console.error('Error fetching users for cron job:', error);
    }
  }

  /**
   * for get all users
   * @returns list of all users
   */
  findAll() {
    return this.userReposirty.find();
  }

  /**
   * to find a user by id
   * @param id user id
   * @returns user from DB
   */
  async findOne(id: number) {
   
    const user = await this.userReposirty.findOne({ where: { user_id: id } });
    if (!user) throw new BadRequestException('the user is not found');
    return user;
  }

  /**
   * to change the password of a user
   * @param changePaasword object contains old and new password
   * @param userId user id
   * @returns new password
   */
  async changePassword(changePaasword: ChangePasswordDto, userId: any) {
    const user = await this.userReposirty
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.user_id=:user_id', { user_id: userId })
      .getOne();
    if (!user) throw new NotFoundException('User not found');

    const isPasswordMatched = bcrypt.compare(
      changePaasword.oldPassword,
      user.password,
    );
    if (!isPasswordMatched) {
      throw new BadRequestException('Old password is incorrect');
    }
    const slat = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(changePaasword.newPassword, slat);
    user.password = hashedPassword;
    await this.userReposirty.save(user);
    return { msg: 'Password changed successfully' };
  }

  /**
   * for forgot password
   * @param email to find the user
   * @returns new reset code and expiry time
   */
  // async forgotPassword(email: string) {
  //   const user = await this.userReposirty
  //     .createQueryBuilder('users')
  //     .addSelect('users.password')
  //     .where('users.email=:email', { email: email })
  //     .getOne();
  //   if (!user) throw new NotFoundException('User not found');

  //   const code = Math.floor(100000 + Math.random() * 900000).toString();
  //   const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  //   user.reset_code = code;
  //   user.reset_code_expiry = expiry;
  //   await this.userReposirty.save(user);

  //   await this.emailService.sendEmailReset(user.email, user.reset_code);

  //   return { msg: 'Reset code sent to your email' };
  // }

  /**
   * to verify the reset code
   * @param email to find the user
   * @param code to verify
   * @returns confirmation message
   */
  // async verifyResetCode(email: string, code: string) {
  //   const user = await this.userReposirty.findOne({ where: { email } });
  //   if (!user || user.reset_code !== code) {
  //     throw new BadRequestException('Invalid code');
  //   }
  //   if (user.reset_code_expiry < new Date()) {
  //     throw new BadRequestException('Code expired');
  //   }
  //   return { msg: 'Code verified' };
  // }

  /**
   *  update user information
   * @param id user id
   * @param updateUserDto body user to update
   * @returns update information
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  /**
   * to remove a user
   * @param id user id
   * @returns returns a message that the user is removed
   */
  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  /**
   * generate JWT token
   * @param payload to put in the token
   * @returns new JWT token
   */
  private async generateJwt(payload: any) {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}

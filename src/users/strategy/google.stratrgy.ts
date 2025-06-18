import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth2';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly config: ConfigService) {

    super({
      clientID: config.get<string>('CLIENT_ID'),
      clientSecret: config.get<string>('CLIENT_SECRET'),
      callbackURL: config.get<string>('CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: any) {
    const user = {
      accessToken,
      refreshToken,
      profile,
    };
    return user;
  }
}

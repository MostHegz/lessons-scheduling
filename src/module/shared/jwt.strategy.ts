import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Constants } from 'src/common';
import { JwtPayloadInterface } from 'src/interface';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger('JwtStrategy');

  constructor() {
    super({
      secretOrKey: Constants.JWT_SECRET_KEY,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<JwtPayloadInterface> {
    return new Promise(async (resolve, reject) => {
      try {
        payload.userId = +payload['sub'];
        resolve(payload);
      } catch (error) {
        this.logger.error(error);
        return reject(new InternalServerErrorException());
      }
    });
  }
}

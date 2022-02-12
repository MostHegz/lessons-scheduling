import { HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Constants } from 'src/common';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        HttpModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: Constants.JWT_SECRET_KEY,
        })
    ],
    controllers: [],
    providers: [
        JwtStrategy
    ],
    exports: [
        PassportModule,
        JwtStrategy
    ]
}) export class SharedModule { }

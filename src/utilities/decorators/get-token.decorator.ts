import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadInterface } from 'src/interface';


export const GetToken = createParamDecorator((_data, ctx: ExecutionContext): JwtPayloadInterface => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});

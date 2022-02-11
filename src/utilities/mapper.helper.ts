import { Logger } from '@nestjs/common';
import { ClassConstructor, instanceToPlain, plainToClass } from 'class-transformer';

export class MapperHelper {
    static logger = new Logger('UserRepository');

    static toClient<T>(classType: ClassConstructor<T>, fromObject: Object): T {
        const mapped = plainToClass(classType, fromObject, { excludeExtraneousValues: true });
        return mapped;
    }

    static toClientList<T>(classType: ClassConstructor<T>, fromObjectList: Object[]): T[] {
        const returnList: T[] = [];
        for (const fromObject of fromObjectList) {
            returnList.push(this.toClient(classType, fromObject));
        }
        return returnList;
    }
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';
import { ErrorMessage } from 'src/common';
import { BetweenDatesInterface } from 'src/interface';
import { IsGreaterThan } from 'src/utilities';

export class GetLessonsDto implements BetweenDatesInterface {

    @ApiProperty({
        example: '2022-01-30T13:00:00.000Z',
        description: 'lessons from date',
        required: true
    })
    @IsDate({ message: ErrorMessage.StartDateRequired })
    @Type(() => Date)
    public from: Date;

    @ApiProperty({
        example: '2022-02-28T14:00:00.000Z',
        description: 'lessons to this date',
        required: true
    })
    @IsDate({ message: ErrorMessage.EndDateRequired })
    @IsGreaterThan('from', { message: ErrorMessage.EndDateAfterStartDate })
    @Type(() => Date)
    public to: Date;
}

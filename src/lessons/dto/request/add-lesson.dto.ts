import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsDefined, IsEnum, IsNotEmpty, ValidateIf } from 'class-validator';
import { ErrorMessage, RecurrenceType } from 'src/common';
import { Days } from 'src/common/recurrence';
import { IsGreaterThan } from 'src/utilities';

export class AddLessonDto {

    @ApiProperty({
        example: 2,
        description: 'user id',
        required: true
    })
    @IsNotEmpty({ message: ErrorMessage.UserRequired })
    @Type(() => Number)
    public userId: number;

    @ApiProperty({
        example: 'Lesson Title',
        description: 'Lesson title',
        required: true
    })
    @IsNotEmpty({ message: ErrorMessage.TitleRequired })
    public title: string;

    @ApiProperty({
        example: 'Lesson description',
        description: 'Lesson description',
        required: true
    })
    @IsNotEmpty({ message: ErrorMessage.DescriptionRequired })
    public description: string;

    @ApiProperty({
        example: '2022-12-30T13:00:00.000Z',
        description: 'Lesson start at',
        required: true
    })
    @IsDate({ message: ErrorMessage.LessonStartRequired })
    @Type(() => Date)
    public startAt: Date;

    @ApiProperty({
        example: '2022-12-30T14:00:00.000Z',
        description: 'Lesson end at',
        required: true
    })
    @IsDefined({ message: ErrorMessage.RecurrenceEndRequired })
    @Type(() => Number)
    public durationInMilliSeconds: number;

    @ApiProperty({
        example: '2022-12-30T14:00:00.000Z',
        description: 'Lesson end at',
        required: true
    })
    @ValidateIf(input => input.recurrence !== RecurrenceType.None)
    @IsDate({ message: ErrorMessage.RecurrenceEndRequired })
    @IsGreaterThan('startAt', { message: ErrorMessage.RecurrenceEndAfterEnd })
    @Type(() => Date)
    public recurrenceEndAt: Date;

    @ApiProperty({
        example: RecurrenceType.Daily,
        description: 'Lesson recurrence',
        required: false,
        enum: RecurrenceType
    })
    @IsEnum(RecurrenceType)
    public recurrence: RecurrenceType = RecurrenceType.None;

    @ApiProperty({
        example: [Days.Saturday],
        description: 'Lesson recurrence pattern in week',
        required: false,
        enum: [Days]
    })
    @ValidateIf(input => input.recurrence === RecurrenceType.Weekly)
    @IsArray()
    @IsEnum(Days, { each: true })
    public days: Days[];

}


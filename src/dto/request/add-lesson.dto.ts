import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsDefined, IsEnum, IsNotEmpty, ValidateIf } from 'class-validator';
import { Days, ErrorMessage, RecurrenceType } from 'src/data/enum';
import { IsGreaterThan } from 'src/utilities';

export class AddLessonDto {

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
        example: '2022-01-30T13:00:00.000Z',
        description: 'first lesson starts at',
        required: true
    })
    @IsDate({ message: ErrorMessage.LessonStartRequired })
    @Type(() => Date)
    public firstLessonStartsAt: Date;

    @ApiProperty({
        example: '3600000',
        description: 'Lesson end at',
        required: true
    })
    @IsDefined({ message: ErrorMessage.RecurrenceEndRequired })
    @Type(() => Number)
    public durationInMilliSeconds: number;

    @ApiProperty({
        example: '2022-02-28T14:00:00.000Z',
        description: 'Lesson recurrence end at',
        required: true
    })
    @ValidateIf(input => input.recurrence !== RecurrenceType.None)
    @IsDate({ message: ErrorMessage.RecurrenceEndRequired })
    @IsGreaterThan('firstLessonStartsAt', { message: ErrorMessage.EndDateAfterStartDate })
    @Type(() => Date)
    public lastLessonEndsAt: Date;

    @ApiProperty({
        example: RecurrenceType.Daily,
        description: 'Lesson recurrence',
        required: false,
        enum: RecurrenceType
    })
    @IsEnum(RecurrenceType)
    public recurrence: RecurrenceType = RecurrenceType.None;

    @ApiProperty({
        example: [Days.Sunday],
        description: 'Lesson recurrence pattern in week',
        required: false,
        enum: [Days]
    })
    @ValidateIf(input => input.recurrence === RecurrenceType.Weekly)
    @IsArray()
    @IsEnum(Days, { each: true })
    public recurrenceDays: Days[];

}


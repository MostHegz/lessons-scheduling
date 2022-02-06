import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';
import { ErrorMessage } from 'src/common';
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
    @IsDate({ message: ErrorMessage.LessonEndRequired })
    @IsGreaterThan('startAt', { message: ErrorMessage.LessonEndAfterStart })
    @Type(() => Date)
    public endAt: Date;

}


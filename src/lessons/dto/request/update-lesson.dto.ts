import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsMongoId, IsOptional, ValidateIf } from 'class-validator';
import { ErrorMessage, LessonUpdateType } from 'src/common';
import { AddLessonDto } from './add-lesson.dto';

export class UpdateLessonDto extends AddLessonDto {

    @ApiProperty({
        example: '6206309fc5fdf5dcca42fc95',
        description: 'user id',
        required: true
    })
    @IsMongoId({ message: ErrorMessage.LessonRequired })
    public lessonId: string;

    @ApiProperty({
        example: LessonUpdateType.Single,
        enum: LessonUpdateType,
        required: true
    })
    @IsEnum(LessonUpdateType)
    public type: LessonUpdateType;

    @ApiProperty({
        example: '2022-01-30T13:00:00.000Z',
        description: 'If editing a single recurrence date send the old date before',
        required: true
    })
    @ValidateIf(input => input.type === LessonUpdateType.Single)
    @IsDate({ message: ErrorMessage.OldDateRequired })
    @Type(() => Date)
    public oldDate: Date;

    @ApiProperty({
        example: '2022-01-30T13:00:00.000Z',
        description: 'If editing a single recurrence date send the new date',
        required: true
    })
    @ValidateIf(input => input.oldDate)
    @IsDate({ message: ErrorMessage.NewDateRequired })
    @Type(() => Date)
    public newDate: Date;

}
